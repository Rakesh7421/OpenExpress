import React, { useState, useCallback, useEffect } from 'react';
import { Icon } from './common/Icon';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'warning';

interface CheckResult {
    status: Status;
    message?: string;
}

const META_SCOPES: Record<string, { label: string, scopes: string }> = {
  basic_info: { label: 'Basic Info', scopes: 'public_profile,email' },
  page_access: { label: 'Page & Group Access', scopes: 'pages_show_list,groups_access_member_info' },
  page_posting: { label: 'Page Posting (Video)', scopes: 'pages_manage_posts,publish_video,pages_read_engagement' },
  group_posting: { label: 'Group Posting (Video)', scopes: 'publish_to_groups' },
  instagram_posting: { label: 'Instagram Posting', scopes: 'instagram_basic,instagram_content_publish' },
};

const getStatusIcon = (status: Status) => {
    switch (status) {
        case 'loading':
            return <Icon name="loader" className="w-5 h-5 animate-spin text-blue-400" title="Testing..." />;
        case 'success':
            return <Icon name="check-circle" className="w-5 h-5 text-green-500" title="Valid" />;
        case 'error':
            return <Icon name="x" className="w-5 h-5 text-red-500" title="Invalid" />;
        case 'warning':
            return <Icon name="info" className="w-5 h-5 text-yellow-500" title="Warning" />;
        case 'idle':
        default:
            return <span className="text-gray-500 font-bold text-lg" title="Not tested">?</span>;
    }
};

const ToolInput: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder?: string; type?: string; isTextarea?: boolean, status?: Status }> = ({ id, label, value, onChange, placeholder, type = 'text', isTextarea = false, status }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-gray-400 mb-1 flex items-center justify-between">
            {label}
            {status && <span className="ml-2">{getStatusIcon(status)}</span>}
        </label>
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

const PlatformAuthTools: React.FC = () => {
    // --- State for Inputs ---
    const [appId, setAppId] = useState('');
    const [appSecret, setAppSecret] = useState('');
    const [userToken, setUserToken] = useState('');
    const [pageToken, setPageToken] = useState('');
    const [pageId, setPageId] = useState('');
    const [groupId, setGroupId] = useState('');
    const [redirectUri, setRedirectUri] = useState('http://localhost:8080/auth/facebook/callback');
    const [requiredScopes, setRequiredScopes] = useState('public_profile,email');
    
    // --- State for Validation Statuses ---
    const [userTokenCheck, setUserTokenCheck] = useState<CheckResult>({ status: 'idle' });
    const [pageTokenCheck, setPageTokenCheck] = useState<CheckResult>({ status: 'idle' });
    const [scopesCheck, setScopesCheck] = useState<CheckResult>({ status: 'idle' });
    const [isAllCheckRunning, setIsAllCheckRunning] = useState(false);

    // --- State for Guided Flow ---
    const [guidedAuthCode, setGuidedAuthCode] = useState('');
    const [guidedUserToken, setGuidedUserToken] = useState('');
    const [guidedPages, setGuidedPages] = useState<any[]>([]);
    const [guidedRedirectUri, setGuidedRedirectUri] = useState('http://localhost:8080/auth/facebook/callback-code-only');
    
    // --- State for Data Fetching Tools ---
    const [fetchedPages, setFetchedPages] = useState<any[] | null>(null);


    // --- State for Logs ---
    const [logs, setLogs] = useState<string[]>([]);
    
    const logResult = useCallback((message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 100)); // Keep last 100 logs
    }, []);

    // Effect to listen for the auth code from the popup window
    useEffect(() => {
        const handleAuthMessage = (event: MessageEvent) => {
            const { type, platform, code } = event.data;
            if (type === 'auth-code-received' && platform === 'meta' && code) {
                logResult("✅ Auth code received automatically from popup.");
                setGuidedAuthCode(code);
            } else if (type === 'auth-failure') {
                logResult(`❌ Authentication failed in popup for platform: ${platform}.`);
            }
        };

        window.addEventListener('message', handleAuthMessage);
        return () => window.removeEventListener('message', handleAuthMessage);
    }, [logResult]);

    // --- Core API Logic ---
    const validateUserTokenAPI = useCallback(async (token: string, id: string, secret: string) => {
        if (!token || !id || !secret) throw new Error("User Token, App ID, and App Secret are required.");
        const appAccessToken = `${id}|${secret}`;
        const url = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appAccessToken}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error?.message || 'Request failed');
        if (!data.data?.is_valid) throw new Error('Token is invalid according to Facebook.');
        return data;
    }, []);

    const validatePageTokenAPI = useCallback(async (token: string, id: string) => {
        if (!token || !id) throw new Error("Page Token and Page ID are required.");
        const url = `https://graph.facebook.com/${id}?fields=name,id&access_token=${token}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Request failed');
        return data;
    }, []);
    
    // --- Test Handlers ---
    const handleTestUserToken = useCallback(async () => {
        setUserTokenCheck({ status: 'loading' });
        try {
            await validateUserTokenAPI(userToken, appId, appSecret);
            setUserTokenCheck({ status: 'success' });
            logResult("✅ User Token is valid.");
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setUserTokenCheck({ status: 'error', message });
            logResult(`❌ User Token Test Failed: ${message}`);
        }
    }, [userToken, appId, appSecret, validateUserTokenAPI, logResult]);
    
    const handleTestPageToken = useCallback(async () => {
        setPageTokenCheck({ status: 'loading' });
        try {
            const res = await validatePageTokenAPI(pageToken, pageId);
            setPageTokenCheck({ status: 'success' });
            logResult(`✅ Page Token is valid for page: ${res.name}.`);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setPageTokenCheck({ status: 'error', message });
            logResult(`❌ Page Token Test Failed: ${message}`);
        }
    }, [pageToken, pageId, validatePageTokenAPI, logResult]);

    const handleTestScopes = useCallback(async () => {
        setScopesCheck({ status: 'loading' });
        try {
            const { data } = await validateUserTokenAPI(userToken, appId, appSecret);
            if (!data || !data.scopes) throw new Error("Could not retrieve scopes from token.");
            
            const required = new Set(requiredScopes.split(',').map(s => s.trim()).filter(Boolean));
            const granted = new Set(data.scopes);
            const missing = [...required].filter(scope => !granted.has(scope));

            if (missing.length === 0) {
                setScopesCheck({ status: 'success' });
                logResult("✅ All required scopes are granted.");
            } else {
                const message = `Missing scopes: ${missing.join(', ')}`;
                setScopesCheck({ status: 'warning', message });
                logResult(`⚠️ Scope Check Warning: ${message}`);
            }
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setScopesCheck({ status: 'error', message });
            logResult(`❌ Scope Test Failed: ${message}`);
        }
    }, [userToken, appId, appSecret, requiredScopes, validateUserTokenAPI, logResult]);

    const runAllChecks = useCallback(async () => {
        setIsAllCheckRunning(true);
        logResult("🔄 Starting automatic health check...");
        await handleTestUserToken();
        await handleTestPageToken();
        await handleTestScopes();
        logResult("✅ Health check complete.");
        setIsAllCheckRunning(false);
    }, [handleTestUserToken, handleTestPageToken, handleTestScopes, logResult]);

    const handleGenericApiCall = async (logName: string, apiFn: () => Promise<any>) => {
        logResult(`🔄 Running: ${logName}...`);
        try {
            const response = await apiFn();
            const message = JSON.stringify(response, null, 2);
            logResult(`✅ Success [${logName}]:\n${message}`);
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            logResult(`❌ Error [${logName}]: ${message}`);
        }
    };
    
    // --- Guided Flow Handlers ---
    const handleGetCode = (scopes: string, isRerequest: boolean = false) => {
        if (!appId || !guidedRedirectUri) {
            logResult("❌ Error: App ID and a valid Redirect URI are required to start the auth flow.");
            return;
        }
        const params: Record<string, string> = {
            client_id: appId,
            redirect_uri: guidedRedirectUri,
            scope: scopes,
            response_type: 'code',
            state: `csrf_token_${Math.random().toString(36).substring(7)}`,
        };
        
        if (isRerequest) {
            params.auth_type = 'rerequest';
        }

        const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?${new URLSearchParams(params).toString()}`;
        logResult(`Opening Meta auth URL for scopes: ${scopes}`);
        window.open(authUrl, '_blank', 'width=600,height=700');
    };
    
    const handleExchangeCode = async () => {
        const response = await handleGenericApiCall("Exchange Code for Token", async () => {
            if (!guidedAuthCode || !appId || !appSecret || !guidedRedirectUri) throw new Error("Auth Code, App ID, Secret, and Redirect URI are required.");
            const url = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(guidedRedirectUri)}&client_secret=${appSecret}&code=${guidedAuthCode}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Request failed');
            return data;
        });
        if (response?.access_token) {
            setUserToken(response.access_token);
            setGuidedUserToken(response.access_token);
            setGuidedAuthCode(''); // Consume the code
        }
    };

    const handleFetchPages = async () => {
        setGuidedPages([]);
        const response = await handleGenericApiCall("Fetch Page Tokens", async () => {
            if (!guidedUserToken) throw new Error("A valid User Token from Step 2 is required.");
            const url = `https://graph.facebook.com/me/accounts?fields=name,id,access_token&access_token=${guidedUserToken}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Request failed');
            return data;
        });
        if (response?.data) {
            if (response.data.length > 0) {
                setGuidedPages(response.data);
            } else {
                logResult("ℹ️ No pages found. This may be because the user token lacks `pages_show_list` permission. Try Step 3 to request more permissions.");
            }
        }
    };
    
    const handleFetchPagesAction = async () => {
        setFetchedPages(null); // Clear previous results
        const response = await handleGenericApiCall("Fetch Pages & Tokens", async () => {
            if (!userToken) throw new Error("A valid User Token from the Health Check panel is required.");
            const url = `https://graph.facebook.com/me/accounts?fields=name,id,access_token&access_token=${userToken}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Request failed');
            return data;
        });
        if (response?.data) {
            if (response.data.length > 0) {
                setFetchedPages(response.data);
            } else {
                logResult("ℹ️ No pages found associated with this User Token.");
            }
        }
    };

    const handleScopePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presetKey = e.target.value;
        if (META_SCOPES[presetKey]) {
            setRequiredScopes(META_SCOPES[presetKey].scopes);
            logResult(`Loaded scopes for "${META_SCOPES[presetKey].label}" use case.`);
        }
    };


    return (
        <div className="p-4 space-y-6 text-gray-300">
            <details className="p-4 bg-gray-800 rounded-lg border border-gray-700/80 open:pb-4 transition-all" open>
                <summary className="text-md font-semibold text-gray-200 cursor-pointer">Guided Authentication Flow</summary>
                <div className="mt-4 space-y-4 border-t border-gray-700 pt-4">
                    {/* Step 1 */}
                    <div className="space-y-2 p-3 bg-gray-900/50 rounded-md">
                        <p className="font-semibold text-sm">Step 1: Get Basic Authentication</p>
                        <p className="text-xs text-gray-400">This will request basic permissions (`public_profile`, `email`) to get an initial User Token.</p>
                        <button onClick={() => handleGetCode(META_SCOPES.basic_info.scopes)} className="text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-md py-1 px-3">1. Login & Get Basic Auth Code</button>
                    </div>

                    {/* Step 2 */}
                    {guidedAuthCode && (
                        <div className="space-y-2 p-3 bg-gray-900/50 rounded-md animate-fade-in">
                            <p className="font-semibold text-sm">Step 2: Exchange Code for User Token</p>
                            <p className="text-xs text-gray-400">Auth Code Received! Click to exchange it for a token.</p>
                            <p className="text-xs text-gray-400">Code: <code className="text-gray-300 bg-gray-800 p-1 rounded font-mono text-xs break-all">{guidedAuthCode}</code></p>
                            <button onClick={handleExchangeCode} className="text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-md py-1 px-3">2. Get User Token</button>
                        </div>
                    )}
                    
                    {/* Step 3 */}
                    {guidedUserToken && (
                        <div className="space-y-2 p-3 bg-gray-900/50 rounded-md animate-fade-in">
                            <p className="font-semibold text-sm">Step 3: Get Additional Permissions</p>
                            <p className="text-xs text-gray-400">Now that you are authenticated, you can ask the user for more permissions, such as access to their Pages.</p>
                            <button onClick={() => handleGetCode(META_SCOPES.page_access.scopes, true)} className="text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-md py-1 px-3">3. Request Page Permissions</button>
                        </div>
                    )}
                    
                    {/* Step 4 */}
                    {guidedUserToken && (
                         <div className="space-y-2 p-3 bg-gray-900/50 rounded-md animate-fade-in">
                            <p className="font-semibold text-sm">Step 4: Fetch Pages & Page Tokens</p>
                            <p className="text-xs text-gray-400">If the user has granted page permissions, you can now fetch their pages.</p>
                            <button onClick={handleFetchPages} className="text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-md py-1 px-3">4. Fetch Pages</button>
                            {guidedPages.length > 0 && (
                                <div className="mt-2 text-xs max-h-48 overflow-y-auto">
                                    {guidedPages.map(page => (
                                        <div key={page.id} className="p-2 border-b border-gray-700 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-gray-200">{page.name}</p>
                                                <p className="font-mono"><b>ID:</b> {page.id}</p>
                                                <p className="font-mono break-all"><b>Token:</b> {page.access_token.substring(0, 40)}...</p>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    setPageId(page.id);
                                                    setPageToken(page.access_token);
                                                    logResult(`Loaded credentials for page: "${page.name}".`);
                                                }}
                                                className="text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-md py-1 px-3 transition-colors flex-shrink-0"
                                            >
                                                Use Page
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </details>

            <details className="p-4 bg-gray-800 rounded-lg border border-gray-700/80 open:pb-4 transition-all">
                <summary className="text-md font-semibold text-gray-200 cursor-pointer">Authentication Health Check</summary>
                <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">
                    <p className="text-xs text-gray-500">Enter your credentials and run checks to validate your setup.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <ToolInput id="appId" label="App ID" value={appId} onChange={e => setAppId(e.target.value)} placeholder="Your Meta App ID" />
                        <ToolInput id="appSecret" label="App Secret" value={appSecret} onChange={e => setAppSecret(e.target.value)} type="password" placeholder="Your Meta App Secret" />
                    </div>
                    <ToolInput id="userToken" label="User Access Token" value={userToken} onChange={e => setUserToken(e.target.value)} isTextarea status={userTokenCheck.status} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <ToolInput id="pageToken" label="Page Access Token" value={pageToken} onChange={e => setPageToken(e.target.value)} isTextarea status={pageTokenCheck.status} />
                        <ToolInput id="pageId" label="Page ID" value={pageId} onChange={e => setPageId(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="scope-preset" className="block text-xs font-medium text-gray-400 mb-1">Select Use Case (Scope Preset)</label>
                        <select
                            id="scope-preset"
                            onChange={handleScopePresetChange}
                            className="w-full p-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition text-xs"
                        >
                            <option value="">-- Select a preset to load scopes --</option>
                            {Object.entries(META_SCOPES).map(([key, { label }]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <ToolInput id="requiredScopes" label="Required Scopes" value={requiredScopes} onChange={e => setRequiredScopes(e.target.value)} isTextarea status={scopesCheck.status}/>
                    <button
                        onClick={runAllChecks}
                        disabled={isAllCheckRunning}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-wait"
                    >
                        {isAllCheckRunning ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="check-circle" className="w-5 h-5" />}
                        Run All Checks
                    </button>
                </div>
            </details>
            
            <details className="p-4 bg-gray-900 rounded-lg border border-gray-700/80 open:pb-4 transition-all">
                <summary className="text-sm font-semibold text-gray-200 cursor-pointer">Data Fetching Tools</summary>
                <div className="mt-4 space-y-4 border-t border-gray-700 pt-4">
                    <div>
                        <button onClick={handleFetchPagesAction} className="text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-md py-1 px-3">Fetch Pages & Tokens</button>
                        {fetchedPages && (
                            <div className="mt-2 text-xs max-h-48 overflow-y-auto border border-gray-700 rounded-md">
                                {fetchedPages.map(page => (
                                    <div key={page.id} className="p-2 border-b border-gray-700/50 flex justify-between items-center last:border-b-0">
                                        <div>
                                            <p className="font-bold text-gray-200">{page.name}</p>
                                            <p className="font-mono"><b>ID:</b> {page.id}</p>
                                            <p className="font-mono break-all"><b>Token:</b> {page.access_token.substring(0, 40)}...</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setPageId(page.id);
                                                setPageToken(page.access_token);
                                                logResult(`✅ Loaded credentials for page: "${page.name}". You can now test the page token.`);
                                            }}
                                            className="text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-md py-1 px-3 transition-colors flex-shrink-0 ml-2"
                                        >
                                            Use Page
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="border-t border-gray-800 pt-4">
                        <ToolInput id="groupId" label="Group ID" value={groupId} onChange={e => setGroupId(e.target.value)} />
                         <button onClick={() => handleGenericApiCall("Fetch Group Info", async () => {
                             if (!userToken || !groupId) throw new Error("User Token and Group ID are required.");
                              const url = `https://graph.facebook.com/${groupId}?fields=id,name,privacy&access_token=${userToken}`;
                              const res = await fetch(url);
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error?.message || 'Request failed');
                              return data;
                         })} className="text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-md py-1 px-3 mt-2">Fetch Group Info</button>
                    </div>
                </div>
            </details>
            
            {logs.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Logs</h4>
                    <pre className="p-3 rounded-md text-xs font-mono overflow-y-auto max-h-80 bg-gray-900 border border-gray-700/80">
                        {logs.join('\n')}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default PlatformAuthTools;