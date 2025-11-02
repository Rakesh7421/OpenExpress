import React, { useState, useCallback } from 'react';
import { Icon } from './common/Icon';

type ResultState = {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
} | null;

const ToolInput: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder?: string; type?: string; isTextarea?: boolean }> = ({ id, label, value, onChange, placeholder, type = 'text', isTextarea = false }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
        {isTextarea ? (
             <textarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={3}
                className="w-full p-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition font-mono text-xs"
             />
        ) : (
             <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition font-mono text-xs"
             />
        )}
    </div>
);

const ToolButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-wait"
    >
        {children}
    </button>
);

const ResultDisplay: React.FC<{ result: ResultState }> = ({ result }) => {
    if (!result || result.status === 'idle') return null;

    const baseClasses = 'mt-3 text-xs p-3 rounded-md font-mono whitespace-pre-wrap break-words max-h-60 overflow-y-auto';
    const styles = {
        loading: 'bg-blue-900/50 text-blue-300 animate-pulse',
        success: 'bg-green-900/50 text-green-300',
        error: 'bg-red-900/50 text-red-300',
    };

    return (
        <div className={`${baseClasses} ${styles[result.status as keyof typeof styles]}`}>
            {result.message}
        </div>
    );
};


const PlatformAuthTools: React.FC = () => {
    const [appId, setAppId] = useState('');
    const [appSecret, setAppSecret] = useState('');
    const [userToken, setUserToken] = useState('');
    const [pageToken, setPageToken] = useState('');
    const [pageId, setPageId] = useState('');
    const [groupId, setGroupId] = useState('');
    const [callbackUrl, setCallbackUrl] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [redirectUri, setRedirectUri] = useState('http://localhost:8080/');
    const [requiredScopes, setRequiredScopes] = useState('pages_manage_posts,publish_video,pages_read_engagement,publish_to_groups');
    
    const [results, setResults] = useState<{[key: string]: ResultState}>({});

    const handleApiCall = useCallback(async (key: string, apiFn: () => Promise<any>) => {
        setResults(prev => ({ ...prev, [key]: { status: 'loading', message: 'Executing...' }}));
        try {
            const response = await apiFn();
            const message = JSON.stringify(response, null, 2);
            setResults(prev => ({ ...prev, [key]: { status: 'success', message }}));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            setResults(prev => ({ ...prev, [key]: { status: 'error', message }}));
        }
    }, []);

    // --- API Functions ---
    const validateUserToken = async () => {
        if (!userToken || !appId || !appSecret) throw new Error("User Token, App ID, and App Secret are required.");
        const appAccessToken = `${appId}|${appSecret}`;
        const url = `https://graph.facebook.com/debug_token?input_token=${userToken}&access_token=${appAccessToken}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Request failed');
        return data;
    };

    const validatePageToken = async () => {
        if (!pageToken || !pageId) throw new Error("Page Token and Page ID are required.");
        const url = `https://graph.facebook.com/${pageId}?fields=name,id&access_token=${pageToken}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Request failed');
        return data;
    };
    
    const validateScopes = async () => {
        const { data } = await validateUserToken();
        if (!data || !data.scopes) throw new Error("Could not retrieve scopes from token.");
        
        const required = new Set(requiredScopes.split(',').map(s => s.trim()).filter(Boolean));
        const granted = new Set(data.scopes);
        
        const missing = [...required].filter(scope => !granted.has(scope));

        return {
            "granted_scopes": [...granted],
            "required_scopes": [...required],
            "missing_scopes": missing,
            "all_required_scopes_granted": missing.length === 0,
        };
    };

    const runOverallAuthTest = async () => {
        const results: any = {};
        try {
            const userTokenRes = await validateUserToken();
            results.user_token_validation = { status: 'success', data: userTokenRes.data };
        } catch(e: any) { results.user_token_validation = { status: 'error', message: e.message }; }
        
        try {
            const pageTokenRes = await validatePageToken();
            results.page_token_validation = { status: 'success', data: pageTokenRes };
        } catch(e: any) { results.page_token_validation = { status: 'error', message: e.message }; }

        try {
            const scopeRes = await validateScopes();
            results.scope_validation = { status: 'success', data: scopeRes };
        } catch(e: any) { results.scope_validation = { status: 'error', message: e.message }; }
        
        return results;
    };
    
    const parseCallbackUrl = () => {
      if (!callbackUrl) throw new Error("Callback URL is required.");
      try {
        const url = new URL(callbackUrl);
        const code = url.searchParams.get('code');
        if (!code) throw new Error("URL does not contain a 'code' parameter.");
        setAuthCode(code);
        return { extracted_code: code };
      } catch (e: any) {
        throw new Error(`Invalid URL: ${e.message}`);
      }
    };
    
    const exchangeCodeForToken = async () => {
      if (!authCode || !appId || !appSecret || !redirectUri) throw new Error("Auth Code, App ID, Secret, and Redirect URI are required.");
      const url = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${authCode}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Request failed');
      setUserToken(data.access_token);
      return data;
    };

    const fetchPageTokens = async () => {
      if (!userToken) throw new Error("A valid User Token is required.");
      const url = `https://graph.facebook.com/me/accounts?access_token=${userToken}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Request failed');
      return data;
    };

    const fetchGroupInfo = async () => {
      if (!userToken || !groupId) throw new Error("User Token and Group ID are required.");
      const url = `https://graph.facebook.com/${groupId}?fields=id,name,privacy&access_token=${userToken}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Request failed');
      return data;
    };
    

    const toolSections = [
        { key: 'userToken', title: '1. User Token Validation', fn: validateUserToken, fields: ['userToken', 'appId', 'appSecret'] },
        { key: 'pageToken', title: '2. Page Token Validation', fn: validatePageToken, fields: ['pageToken', 'pageId'] },
        { key: 'scopes', title: '3. Scope Validation', fn: validateScopes, fields: ['userToken', 'appId', 'appSecret', 'requiredScopes'] },
        { key: 'overall', title: '4. Overall Authentication Test', fn: runOverallAuthTest, fields: ['userToken', 'appId', 'appSecret', 'pageToken', 'pageId', 'requiredScopes']},
        { key: 'parseUrl', title: '5. Parse OAuth Callback URL', fn: parseCallbackUrl, fields: ['callbackUrl'] },
        { key: 'exchangeCode', title: '6. Exchange Code for Token', fn: exchangeCodeForToken, fields: ['authCode', 'appId', 'appSecret', 'redirectUri'] },
        { key: 'fetchPages', title: '7. Fetch Page Tokens', fn: fetchPageTokens, fields: ['userToken'] },
        { key: 'fetchGroup', title: '8. Fetch Group Info', fn: fetchGroupInfo, fields: ['userToken', 'groupId'] },
    ];
    
    return (
        <div className="p-4 space-y-6 text-gray-300">
             <div className="p-4 bg-gray-900 rounded-lg border border-gray-700/80 space-y-3">
                 <h4 className="text-sm font-semibold text-gray-200">Common Credentials</h4>
                 <p className="text-xs text-gray-500">Enter your Meta App credentials here to use them in the tools below.</p>
                 <ToolInput id="appId" label="App ID" value={appId} onChange={e => setAppId(e.target.value)} placeholder="Your Meta App ID" />
                 <ToolInput id="appSecret" label="App Secret" value={appSecret} onChange={e => setAppSecret(e.target.value)} type="password" placeholder="Your Meta App Secret" />
            </div>

            {toolSections.map(section => (
                 <div key={section.key} className="p-4 bg-gray-900 rounded-lg border border-gray-700/80">
                     <h4 className="text-sm font-semibold text-gray-200 mb-3">{section.title}</h4>
                     <div className="space-y-3">
                        {section.fields.includes('userToken') && <ToolInput id="userToken" label="User Access Token" value={userToken} onChange={e => setUserToken(e.target.value)} isTextarea />}
                        {section.fields.includes('pageToken') && <ToolInput id="pageToken" label="Page Access Token" value={pageToken} onChange={e => setPageToken(e.target.value)} isTextarea />}
                        {section.fields.includes('pageId') && <ToolInput id="pageId" label="Page ID" value={pageId} onChange={e => setPageId(e.target.value)} />}
                        {section.fields.includes('groupId') && <ToolInput id="groupId" label="Group ID" value={groupId} onChange={e => setGroupId(e.target.value)} />}
                        {section.fields.includes('requiredScopes') && <ToolInput id="requiredScopes" label="Required Scopes (comma-separated)" value={requiredScopes} onChange={e => setRequiredScopes(e.target.value)} />}
                        {section.fields.includes('callbackUrl') && <ToolInput id="callbackUrl" label="OAuth Callback URL" value={callbackUrl} onChange={e => setCallbackUrl(e.target.value)} placeholder="Paste full URL from browser"/>}
                        {section.fields.includes('authCode') && <ToolInput id="authCode" label="Authorization Code" value={authCode} onChange={e => setAuthCode(e.target.value)} />}
                        {section.fields.includes('redirectUri') && <ToolInput id="redirectUri" label="Your App's Redirect URI" value={redirectUri} onChange={e => setRedirectUri(e.target.value)} />}
                     </div>
                     <ToolButton onClick={() => handleApiCall(section.key, section.fn)} disabled={results[section.key]?.status === 'loading'}>
                        {results[section.key]?.status === 'loading' ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="rocket" className="w-5 h-5" />}
                        Run Test
                     </ToolButton>
                     <ResultDisplay result={results[section.key]} />
                </div>
            ))}
        </div>
    );
};

export default PlatformAuthTools;