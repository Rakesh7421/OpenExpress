import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppVersion, DesignElement, ElementType, ShapeType, TextElement, ShapeElement } from '../types';
import { Icon } from './common/Icon';
import { DEVELOPER_SIDEBAR_ITEMS, CLIENT_SIDEBAR_ITEMS } from '../constants';
import ContentPlanner from './ContentPlanner';
import PlatformAuthTools from './PlatformAuthTools';

// --- Type Definitions for API Action Tester ---
interface ApiActionInput {
  name: string;
  label: string;
  type: 'textarea' | 'file' | 'text';
  placeholder?: string;
}

interface ApiAction {
  id: string;
  label: string;
  platform: 'Meta' | 'X (Twitter)' | 'LinkedIn' | 'TikTok';
  endpoint: string;
  method: 'GET' | 'POST';
  inputs: ApiActionInput[];
  description: string;
}

interface ContentPanelProps {
  activeItem: string;
  onClose: () => void;
  version: AppVersion;
  pushedFeatures: Set<string>;
  onTogglePushFeature: (featureId: string) => void;
  onAddElement: (element: Omit<DesignElement, 'id'>) => void;
}

const initialAppConfig = {
  "last_saved": "2025-11-01T03:29:23.713477+00:00",
  "current_selection": {
    "user": "rakesh",
    "brand": "mv",
    "platform": "Instagram"
  },
  "users": {
    "default_user": {
      "brands": {
        "DefaultBrand": {
          "Facebook": {
            "dev": {
              "facebook_app": { "app_id": "", "app_secret": "", "page_id": "", "group_id": "" },
              "tokens": { "user": "", "page": "" },
              "oauth": { "redirect_uri": "http://localhost:8080/auth/facebook/callback", "scopes": "pages_manage_posts,publish_video,pages_read_engagement,pages_show_list,publish_to_groups,groups_access_member_info" }
            },
            "live": {
              "facebook_app": { "app_id": "", "app_secret": "", "page_id": "", "group_id": "" },
              "tokens": { "user": "", "page": "" },
              "oauth": { "redirect_uri": "http://localhost:8080/auth/facebook/callback", "scopes": "pages_manage_posts,publish_video,pages_read_engagement,pages_show_list,publish_to_groups,groups_access_member_info" }
            }
          },
          "Instagram": {
            "dev": {
              "facebook_app": { "app_id": "", "app_secret": "", "page_id": "", "group_id": "" },
              "tokens": { "user": "", "page": "" },
              "oauth": { "redirect_uri": "http://localhost:8080/auth/facebook/callback", "scopes": "instagram_basic,instagram_content_publish,pages_show_list" }
            },
            "live": {
              "facebook_app": { "app_id": "", "app_secret": "", "page_id": "", "group_id": "" },
              "tokens": { "user": "", "page": "" },
              "oauth": { "redirect_uri": "https://app.com/auth/facebook/callback", "scopes": "instagram_basic,instagram_content_publish,pages_show_list" }
            }
          },
          "Pinterest": {
            "dev": {
              "facebook_app": { "app_id": "", "app_secret": "", "page_id": "", "group_id": "" }, // Note: Pinterest uses different field names, but the UI structure is generic.
              "tokens": { "user": "", "page": "" },
              "oauth": { "redirect_uri": "http://localhost:8080/auth/pinterest/callback", "scopes": "pins:read,pins:write,boards:read,boards:write" }
            },
            "live": {
              "facebook_app": { "app_id": "", "app_secret": "", "page_id": "", "group_id": "" },
              "tokens": { "user": "", "page": "" },
              "oauth": { "redirect_uri": "https://app.com/auth/pinterest/callback", "scopes": "pins:read,pins:write,boards:read,boards:write" }
            }
          }
        }
      }
    },
    "rakesh": {
      "brands": {
        "mv": {
          "Facebook": {
            "dev": {
              "facebook_app": { "app_id": "1268753368113520", "app_secret": "301460da7166044fe2f25515fde0144c", "page_id": "", "group_id": "" },
              "tokens": { "user": "EAASB7KnQYXABPZCnPkmeyAZCKLgJVoLTwISDbiM3E8mSde85YEwh9MiWGkFVKLU6Xbx8MB7GxdTZBmT9GsLONZCKP01eRzxXFEPsiX5qq709bUPofCObPf40JMRvvKZBPcKosZBMtavkzyUcNfXkpHgej2AAZAkcFVuY8jWCvLHDfmtAmBwqAtLzgHaVszmXCfHnNa8A9DH7r5dz3BZCA6YBHqXZCtWqm4Tgnppnh5ZBCGhWbcKy7JNR0qZCkUyMvHBN8Xl1TCgDmLBkNASoMnZBjTfZBN30ovCRNfyT3cgAD", "page": "EAASB7KnQYXABP6NI15Ma8I2KHOTx2eIm0qX2VYKJYNeqPRZBMO3UnVz8FJzQUoFZBt0iuZBKMJGQhQYZB4GV4KJLdR3ljuPX7QDsfq78hadgroGIzWodigVM9EiNkohJ6ZBw2DTMtZCIdqiraBmg3rY0FTUoFDYE5LZBtarL9qFUZAjtR7etVlpBCZCF5fUFAvp20jLRz9VOMUr4d" },
              "oauth": { "redirect_uri": "http://localhost:8080/auth/facebook/callback", "scopes": "pages_manage_posts,publish_video,pages_read_engagement,pages_show_list,publish_to_groups,groups_access_member_info" }
            },
            "live": {
              "facebook_app": { "app_id": "1268753368113520", "app_secret": "301460da7166044fe2f25515fde0144c", "page_id": "", "group_id": "" },
              "tokens": { "user": "EAASB7KnQYXABPZCnPkmeyAZCKLgJVoLTwISDbiM3E8mSde85YEwh9MiWGkFVKLU6Xbx8MB7GxdTZBmT9GsLONZCKP01eRzxXFEPsiX5qq709bUPofCObPf40JMRvvKZBPcKosZBMtavkzyUcNfXkpHgej2AAZAkcFVuY8jWCvLHDfmtAmBwqAtLzgHaVszmXCfHnNa8A9DH7r5dz3BZCA6YBHqXZCtWqm4Tgnppnh5ZBCGhWbcKy7JNR0qZCkUyMvHBN8Xl1TCgDmLBkNASoMnZBjTfZBN30ovCRNfyT3cgAD", "page": "EAASB7KnQYXABP6NI15Ma8I2KHOTx2eIm0qX2VYKJYNeqPRZBMO3UnVz8FJzQUoFZBt0iuZBKMJGQhQYZB4GV4KJLdR3ljuPX7QDsfq78hadgroGIzWodigVM9EiNkohJ6ZBw2DTMtZCIdqiraBmg3rY0FTUoFDYE5LZBtarL9qFUZAjtR7etVlpBCZCF5fUFAvp20jLRz9VOMUr4d" },
              "oauth": { "redirect_uri": "http://localhost:8080/auth/facebook/callback", "scopes": "pages_manage_posts,publish_video,pages_read_engagement,pages_show_list,publish_to_groups,groups_access_member_info" }
            }
          },
          "Instagram": {
            "dev": {
              "facebook_app": { "app_id": "", "app_secret": "", "page_id": "", "group_id": "" },
              "tokens": { "user": "", "page": "" },
              "oauth": { "redirect_uri": "http://localhost:8080/auth/facebook/callback", "scopes": "instagram_basic,instagram_content_publish,pages_show_list" }
            },
            "live": {
              "facebook_app": { "app_id": "", "app_secret": "", "page_id": "", "group_id": "" },
              "tokens": { "user": "", "page": "" },
              "oauth": { "redirect_uri": "https://app.com/auth/facebook/callback", "scopes": "instagram_basic,instagram_content_publish,pages_show_list" }
            }
          },
          "Pinterest": {
            "dev": {
                "facebook_app": { "app_id": "", "app_secret": "", "page_id": "", "group_id": "" },
                "tokens": { "user": "", "page": "" },
                "oauth": { "redirect_uri": "http://localhost:8080/auth/pinterest/callback", "scopes": "pins:read,pins:write,boards:read,boards:write" }
            },
            "live": {
                "facebook_app": { "app_id": "", "app_secret": "", "page_id": "", "group_id": "" },
                "tokens": { "user": "", "page": "" },
                "oauth": { "redirect_uri": "https://app.com/auth/pinterest/callback", "scopes": "pins:read,pins:write,boards:read,boards:write" }
            }
          }
        }
      }
    }
  }
};


// Reusable styled select component
const StyledSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: {value: string, label: string}[] }> = ({ label, id, options, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">
      {label}
    </label>
    <select
      id={id}
      className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition disabled:opacity-50"
      {...props}
    >
      <option value="">Select {label}...</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);


const TemplatesContent: React.FC = () => <div className="p-4 text-gray-400">Templates panel content goes here.</div>;

const TextContent: React.FC<{ onAddElement: (element: Omit<DesignElement, 'id'>) => void }> = ({ onAddElement }) => {
    const addText = (preset: 'heading' | 'subheading' | 'body') => {
        const presets = {
            heading: { content: 'Heading Text', fontSize: 48, width: 300, height: 60 },
            subheading: { content: 'Subheading', fontSize: 28, width: 250, height: 40 },
            body: { content: 'Lorem ipsum dolor sit amet...', fontSize: 16, width: 200, height: 80 },
        };
        const selected = presets[preset];
        onAddElement({
            type: ElementType.TEXT,
            x: 200,
            y: 200,
            width: selected.width,
            height: selected.height,
            rotation: 0,
            content: selected.content,
            fontSize: selected.fontSize,
            color: '#333333',
            fontFamily: 'Inter',
        } as Omit<TextElement, 'id'>);
    }

    return (
        <div className="p-4 space-y-3">
            <button onClick={() => addText('heading')} className="w-full p-4 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors">
                <h3 className="text-2xl font-bold text-white">Add a heading</h3>
            </button>
            <button onClick={() => addText('subheading')} className="w-full p-4 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors">
                <h4 className="text-lg font-semibold text-gray-200">Add a subheading</h4>
            </button>
            <button onClick={() => addText('body')} className="w-full p-4 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors">
                <p className="text-sm text-gray-300">Add body text</p>
            </button>
        </div>
    );
};

const ImagesContent: React.FC = () => <div className="p-4 text-gray-400">Image library and upload options.</div>;

const ShapesContent: React.FC<{ onAddElement: (element: Omit<DesignElement, 'id'>) => void }> = ({ onAddElement }) => {
    const addShape = (shapeType: ShapeType) => {
        onAddElement({
            type: ElementType.SHAPE,
            shapeType,
            x: 250,
            y: 250,
            width: 150,
            height: 150,
            rotation: 0,
            backgroundColor: '#0ea5e9',
            borderColor: '#0284c7',
            borderWidth: 0,
        } as Omit<ShapeElement, 'id'>);
    };
    
    return (
        <div className="p-4">
             <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => addShape(ShapeType.RECTANGLE)} className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg aspect-square hover:bg-gray-700 transition-colors">
                     <div className="w-16 h-16 bg-brand-500"></div>
                     <span className="mt-2 text-sm text-gray-300">Rectangle</span>
                 </button>
                 <button onClick={() => addShape(ShapeType.ELLIPSE)} className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg aspect-square hover:bg-gray-700 transition-colors">
                     <div className="w-16 h-16 bg-brand-500 rounded-full"></div>
                     <span className="mt-2 text-sm text-gray-300">Ellipse</span>
                 </button>
            </div>
        </div>
    );
};

const AiSuggestContent: React.FC = () => <div className="p-4 text-gray-400">AI-powered suggestions for content and design.</div>;

const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: 'text' | 'password'; isTextarea?: boolean }> = ({ label, name, value, onChange, type = 'text', isTextarea = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        {isTextarea ? (
            <textarea
                id={name}
                name={name}
                rows={3}
                value={value}
                onChange={onChange}
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition font-mono text-sm"
            />
        ) : (
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition font-mono text-sm"
            />
        )}
    </div>
);

const PlatformConfiguration: React.FC<{
  platform: string;
  config: any;
  onBack: () => void;
  onSave: (platform: string, newConfig: any) => void;
}> = ({ platform, config, onBack, onSave }) => {
    const [stage, setStage] = useState<'dev' | 'live'>('dev');
    const [formState, setFormState] = useState(config || {});
    const [scopeTestResult, setScopeTestResult] = useState<{status: 'idle' | 'testing' | 'success' | 'error', message: string} | null>(null);

    const handleInputChange = (section: string, field: string, value: string) => {
        setFormState((prev: any) => ({
            ...prev,
            [stage]: {
                ...prev[stage],
                [section]: {
                    ...prev[stage][section],
                    [field]: value
                }
            }
        }));
    };
    
    const handleTestScopes = async () => {
        setScopeTestResult({ status: 'testing', message: 'Testing scopes...' });
        
        const currentConfig = formState[stage] || {};
        const userToken = currentConfig.tokens?.user;
        const appId = currentConfig.facebook_app?.app_id;
        const appSecret = currentConfig.facebook_app?.app_secret;
        const requiredScopes = currentConfig.oauth?.scopes;

        if (!userToken || !appId || !appSecret) {
            setScopeTestResult({ status: 'error', message: 'User Token, App ID, and Secret are required to test scopes.' });
            return;
        }

        try {
            const appAccessToken = `${appId}|${appSecret}`;
            const url = `https://graph.facebook.com/debug_token?input_token=${userToken}&access_token=${appAccessToken}`;
            const res = await fetch(url);
            const data = await res.json();
            
            if (!res.ok || data.error) throw new Error(data.error?.message || 'Request failed');
            if (!data.data?.is_valid) throw new Error('Token is invalid.');
            
            const granted = new Set(data.data.scopes || []);
            const required = new Set(requiredScopes.split(',').map((s: string) => s.trim()).filter(Boolean));
            const missing = [...required].filter(scope => !granted.has(scope));

            if (missing.length === 0) {
                setScopeTestResult({ status: 'success', message: '✅ All required scopes are granted.' });
            } else {
                setScopeTestResult({ status: 'error', message: `⚠️ Missing scopes: ${missing.join(', ')}` });
            }
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setScopeTestResult({ status: 'error', message: `❌ Test failed: ${message}` });
        }
    };


    const currentConfig = formState[stage] || {};

    return (
        <div className="p-4 space-y-4 animate-fade-in flex flex-col h-full">
            <h3 className="text-md font-semibold text-gray-200">Configure {platform}</h3>

            <div className="flex-shrink-0">
                <div className="flex p-1 bg-gray-800 rounded-lg border border-gray-700">
                    <button onClick={() => setStage('dev')} className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-colors ${stage === 'dev' ? 'bg-brand-600' : 'text-gray-400 hover:bg-gray-700'}`}>
                        Development
                    </button>
                    <button onClick={() => setStage('live')} className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-colors ${stage === 'live' ? 'bg-brand-600' : 'text-gray-400 hover:bg-gray-700'}`}>
                        Live
                    </button>
                </div>
            </div>

            <div className="space-y-6 flex-grow overflow-y-auto pr-2">
                <div>
                    <h4 className="font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">App Credentials</h4>
                    <div className="space-y-3 mt-2">
                        <InputField label="App ID" name="app_id" value={currentConfig.facebook_app?.app_id || ''} onChange={(e) => handleInputChange('facebook_app', 'app_id', e.target.value)} />
                        <InputField label="App Secret" name="app_secret" value={currentConfig.facebook_app?.app_secret || ''} onChange={(e) => handleInputChange('facebook_app', 'app_secret', e.target.value)} type="password" />
                        <InputField label="Page ID" name="page_id" value={currentConfig.facebook_app?.page_id || ''} onChange={(e) => handleInputChange('facebook_app', 'page_id', e.target.value)} />
                        <InputField label="Group ID" name="group_id" value={currentConfig.facebook_app?.group_id || ''} onChange={(e) => handleInputChange('facebook_app', 'group_id', e.target.value)} />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">Tokens</h4>
                    <div className="space-y-3 mt-2">
                        <InputField label="User Token" name="user" value={currentConfig.tokens?.user || ''} onChange={(e) => handleInputChange('tokens', 'user', e.target.value)} isTextarea />
                        <InputField label="Page Token" name="page" value={currentConfig.tokens?.page || ''} onChange={(e) => handleInputChange('tokens', 'page', e.target.value)} isTextarea />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">OAuth Settings</h4>
                    <div className="space-y-3 mt-2">
                        <InputField label="Redirect URI" name="redirect_uri" value={currentConfig.oauth?.redirect_uri || ''} onChange={(e) => handleInputChange('oauth', 'redirect_uri', e.target.value)} />
                        <div>
                            <InputField label="Scopes" name="scopes" value={currentConfig.oauth?.scopes || ''} onChange={(e) => handleInputChange('oauth', 'scopes', e.target.value)} isTextarea />
                            <button
                                onClick={handleTestScopes}
                                disabled={scopeTestResult?.status === 'testing'}
                                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border border-gray-600 hover:bg-gray-700 text-gray-300 disabled:opacity-50"
                            >
                                {scopeTestResult?.status === 'testing' ? <Icon name="loader" className="w-4 h-4 animate-spin" /> : <Icon name="sparkles" className="w-4 h-4" />}
                                <span>Test Scopes</span>
                            </button>
                            {scopeTestResult && scopeTestResult.status !== 'testing' && (
                                <div className={`mt-2 p-2 text-xs rounded-md font-mono ${
                                    scopeTestResult.status === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                                }`}>
                                    {scopeTestResult.message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2 mt-auto flex-shrink-0">
                <button onClick={onBack} className="flex-1 px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    Back
                </button>
                <button
                    onClick={() => onSave(platform, formState)}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors"
                >
                    Save Configuration
                </button>
            </div>
        </div>
    );
};


const BrandingContent: React.FC = () => {
    const [appConfig, setAppConfig] = useState(initialAppConfig);
    const [currentUser, setCurrentUser] = useState(initialAppConfig.current_selection.user);
    const [currentBrand, setCurrentBrand] = useState(initialAppConfig.current_selection.brand);
    const [stage, setStage] = useState<'dev' | 'live'>('dev');
    const [validationResult, setValidationResult] = useState<{
      status: 'idle' | 'loading' | 'success' | 'error';
      messages: string[];
    } | null>(null);

    const [connectedAccounts, setConnectedAccounts] = useState<Set<string>>(new Set());
    const [configPlatform, setConfigPlatform] = useState<string | null>(null);

    const socialAccounts = useMemo(() => [
        { id: 'facebook', name: 'Facebook', icon: 'facebook', authId: 'facebook' },
        { id: 'instagram', name: 'Instagram', icon: 'instagram', authId: 'facebook' },
        { id: 'pinterest', name: 'Pinterest', icon: 'pinterest', authId: 'pinterest' },
        { id: 'x', name: 'X (Twitter)', icon: 'x', authId: 'twitter' },
        { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', authId: 'linkedin' },
        { id: 'tiktok', name: 'TikTok', icon: 'tiktok', authId: 'tiktok' },
    ], []);

    // This effect handles the OAuth popup callback
    useEffect(() => {
        const handleAuthMessage = (event: MessageEvent) => {
            const { type, platform, token } = event.data;
            if (type === 'auth-success' && platform && token) {
                console.log(`Auth success for ${platform}`);
                // The platform ID from the server might be 'meta' for facebook/instagram
                const accountId = socialAccounts.find(acc => acc.authId === platform || acc.id === platform)?.id || platform;
                setConnectedAccounts(prev => new Set(prev).add(accountId));
                localStorage.setItem(`${accountId}_jwt`, token);
            } else if (type === 'auth-failure') {
                console.error(`Auth failed for ${platform}`);
                alert(`Authentication with ${platform} failed. Please check the console on the auth server.`);
            }
        };

        window.addEventListener('message', handleAuthMessage);
        return () => window.removeEventListener('message', handleAuthMessage);
    }, [socialAccounts]);

    const handleConnect = (platformName: string) => {
        const socialAccount = socialAccounts.find(acc => acc.name === platformName);
        const authId = socialAccount ? socialAccount.authId : platformName.toLowerCase();
    
        if (platformName === 'Facebook' || platformName === 'Instagram') {
            const platformConfig = appConfig.users[currentUser]?.brands[currentBrand]?.[platformName]?.[stage];
    
            if (!platformConfig) {
                alert(`Configuration for ${platformName} (${stage}) is missing. Please use the 'Configure' button to set it up.`);
                return;
            }
            
            const { app_id } = platformConfig.facebook_app || {};
            const { redirect_uri, scopes } = platformConfig.oauth || {};
    
            if (!app_id || !redirect_uri || !scopes) {
                alert(`Connection failed: App ID, Redirect URI, and Scopes for ${platformName} (${stage}) are all required. Please complete the configuration.\n\nIf the auth popup opens but shows an error, it's likely one of these values is incorrect in your Meta App settings.`);
                return;
            }
    
            const params = new URLSearchParams({
                client_id: app_id,
                redirect_uri: redirect_uri,
                scope: scopes,
                response_type: 'code',
                state: `csrf_token_${Math.random().toString(36).substring(7)}`,
            });
    
            const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
            console.log(`Opening Meta auth URL: ${authUrl}`);
            window.open(authUrl, '_blank', 'width=600,height=700');
    
        } else {
            const authUrl = `/auth/${authId}`;
            console.log(`Opening proxied auth URL: ${authUrl}`);
            window.open(authUrl, '_blank', 'width=500,height=600');
        }
    };
    

    const handleDisconnect = (platformId: string) => {
        setConnectedAccounts(prev => {
            const newSet = new Set(prev);
            newSet.delete(platformId);
            return newSet;
        });
        localStorage.removeItem(`${platformId}_jwt`);
    };

    const handleSavePlatformConfig = (platform: string, newConfig: any) => {
        setAppConfig(prev => {
            const newAppConfig = JSON.parse(JSON.stringify(prev)); // Deep copy
            if (!newAppConfig.users[currentUser].brands[currentBrand]) {
                newAppConfig.users[currentUser].brands[currentBrand] = {};
            }
            newAppConfig.users[currentUser].brands[currentBrand][platform] = newConfig;
            newAppConfig.last_saved = new Date().toISOString();
            return newAppConfig;
        });
        setConfigPlatform(null); // Go back to main branding view
    };

    const handleAddBrand = () => {
        const newBrandName = prompt("Enter a name for the new brand:");
        if (newBrandName && newBrandName.trim()) {
            setAppConfig(prev => {
                const newAppConfig = JSON.parse(JSON.stringify(prev));
                if (!newAppConfig.users[currentUser].brands[newBrandName]) {
                    newAppConfig.users[currentUser].brands[newBrandName] = {};
                    setCurrentBrand(newBrandName);
                } else {
                    alert("A brand with this name already exists.");
                }
                return newAppConfig;
            });
        }
    };

    const handleValidateTokens = async () => {
        setValidationResult({ status: 'loading', messages: ['Validating Facebook tokens...'] });

        const platform = 'Facebook';
        const config = appConfig.users[currentUser]?.brands[currentBrand]?.[platform]?.[stage];
        
        if (!config) {
            setValidationResult({ status: 'error', messages: [`No Facebook configuration found for ${currentUser} > ${currentBrand} (${stage}).`] });
            return;
        }
        
        const { app_id, app_secret, page_id } = config.facebook_app || {};
        const { user: userToken, page: pageToken } = config.tokens || {};
    
        const validationPromises = [];

        // 1. User Token Validation
        if (userToken && app_id && app_secret) {
            const validateUserToken = async () => {
                try {
                    const appAccessToken = `${app_id}|${app_secret}`;
                    const url = `https://graph.facebook.com/debug_token?input_token=${userToken}&access_token=${appAccessToken}`;
                    const res = await fetch(url);
                    const data = await res.json();
                    if (data.error || !data.data?.is_valid) {
                        throw new Error(data.error?.message || 'Token is invalid.');
                    }
                    return '✅ User Token is valid.';
                } catch (e) {
                    const message = e instanceof Error ? e.message : "Unknown error";
                    return `❌ User Token Validation Failed: ${message}`;
                }
            };
            validationPromises.push(validateUserToken());
        } else {
            validationPromises.push(Promise.resolve('⚠️ User Token cannot be validated (missing token, App ID, or App Secret).'));
        }
    
        // 2. Page Token Validation
        if (pageToken && page_id) {
            const validatePageToken = async () => {
                 try {
                    const url = `https://graph.facebook.com/${page_id}?fields=name,id&access_token=${pageToken}`;
                    const res = await fetch(url);
                    const data = await res.json();
                    if (data.error) {
                        throw new Error(data.error.message);
                    }
                    return `✅ Page Token is valid for page: "${data.name}".`;
                } catch (e) {
                    const message = e instanceof Error ? e.message : "Unknown error";
                    return `❌ Page Token Validation Failed: ${message}`;
                }
            };
            validationPromises.push(validatePageToken());
        } else {
            validationPromises.push(Promise.resolve('⚠️ Page Token cannot be validated (missing token or Page ID).'));
        }

        const results = await Promise.all(validationPromises);
        
        const hasError = results.some(r => r.startsWith('❌'));
        setValidationResult({
            status: hasError ? 'error' : 'success',
            messages: results
        });
    };

    if (configPlatform) {
        const platformConfigData = appConfig.users[currentUser]?.brands[currentBrand]?.[configPlatform] || {};
        return <PlatformConfiguration
            platform={configPlatform}
            config={platformConfigData}
            onBack={() => setConfigPlatform(null)}
            onSave={handleSavePlatformConfig}
        />;
    }
    
    const userOptions = Object.keys(appConfig.users).map(u => ({ value: u, label: u }));
    const brandOptions = currentUser ? Object.keys(appConfig.users[currentUser].brands).map(b => ({ value: b, label: b })) : [];

    return (
        <div className="p-4 space-y-6">
            <div>
                <h3 className="text-md font-semibold text-gray-200">Configuration Context</h3>
                <div className="mt-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 space-y-3">
                    <StyledSelect label="User" id="config-user" options={userOptions} value={currentUser} onChange={e => setCurrentUser(e.target.value)} />
                    <StyledSelect label="Brand" id="config-brand" options={brandOptions} value={currentBrand} onChange={e => setCurrentBrand(e.target.value)} />
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Stage</label>
                        <div className="flex p-1 bg-gray-900 rounded-lg border border-gray-600">
                            <button onClick={() => setStage('dev')} className={`flex-1 py-1 text-sm rounded-md transition-colors ${stage === 'dev' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                                Dev
                            </button>
                            <button onClick={() => setStage('live')} className={`flex-1 py-1 text-sm rounded-md transition-colors ${stage === 'live' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                                Live
                            </button>
                        </div>
                    </div>
                    <button onClick={handleAddBrand} className="w-full text-sm text-brand-400 hover:text-brand-300 mt-1 text-left">
                        + Add New Brand
                    </button>
                    <button 
                        onClick={handleValidateTokens}
                        disabled={validationResult?.status === 'loading' || !currentUser || !currentBrand}
                        className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors border border-gray-600 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {validationResult?.status === 'loading' ? (
                            <Icon name="loader" className="w-5 h-5 animate-spin" />
                        ) : (
                            <Icon name="check-circle" className="w-5 h-5" />
                        )}
                        <span>{validationResult?.status === 'loading' ? 'Validating...' : 'Validate Tokens'}</span>
                    </button>

                    {validationResult && validationResult.status !== 'loading' && (
                        <div className="mt-3 p-3 bg-gray-900/50 rounded-md text-xs space-y-1 animate-fade-in">
                            {validationResult.messages.map((msg, index) => (
                                <p key={index} className={`font-mono ${
                                    msg.startsWith('✅') ? 'text-green-400' :
                                    msg.startsWith('❌') ? 'text-red-400' :
                                    'text-yellow-400'
                                }`}>
                                    {msg}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-md font-semibold text-gray-200">Platform Connections</h3>
                 <p className="text-xs text-gray-500 mt-1 mb-2">Note: For 'Connect' to work, credentials in UI must match your backend's .env file.</p>
                <div className="mt-2 space-y-2">
                    {socialAccounts.map(account => {
                        const isConnected = connectedAccounts.has(account.id);
                        return (
                            <div key={account.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Icon name={account.icon} className="w-6 h-6" />
                                    <span className="font-medium text-gray-300">{account.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                     <button 
                                        onClick={() => setConfigPlatform(account.name)}
                                        disabled={!currentUser || !currentBrand}
                                        className="text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-md py-1 px-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Configure
                                    </button>
                                    <button 
                                        onClick={() => isConnected ? handleDisconnect(account.id) : handleConnect(account.name)}
                                        disabled={!currentUser || !currentBrand}
                                        className={`text-xs font-semibold rounded-md py-1 px-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isConnected ? 'bg-red-900/60 hover:bg-red-800/70 text-red-300' : 'bg-brand-600 hover:bg-brand-500 text-white'}`}
                                    >
                                        {isConnected ? 'Disconnect' : 'Connect'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};


const CollaborationContent: React.FC = () => <div className="p-4 text-gray-400">Collaboration tools, comments, and sharing options.</div>;
const VersionControlContent: React.FC = () => <div className="p-4 text-gray-400">History of changes, branching, and version tagging.</div>;

const IntegrationsContent: React.FC = () => {
    const integrations = [
        { name: 'Google Drive', icon: 'drive' },
        { name: 'Slack', icon: 'slack' },
        { name: 'Figma', icon: 'figma' },
        { name: 'Dropbox', icon: 'dropbox' },
    ];

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-md font-semibold text-gray-200">Connect Your Apps</h3>
             <div className="grid grid-cols-2 gap-3">
                {integrations.map(int => (
                    <div key={int.name} className="p-4 bg-gray-800/50 rounded-lg flex flex-col items-center justify-center text-center gap-3 border border-gray-700/50 hover:bg-gray-800 transition-colors">
                        <Icon name={int.icon} className="w-8 h-8" />
                        <span className="text-sm font-medium text-gray-300">{int.name}</span>
                        <button className="text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-md py-1 px-3 transition-colors">
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- API Action Center ---

const apiActions: ApiAction[] = [
    { id: 'meta-post-page', platform: 'Meta', label: 'Post Video to Page', endpoint: '/api/meta/page/video', method: 'POST', inputs: [{ name: 'video', label: 'Video File', type: 'file' }, { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Tell people about your video...' }], description: 'Uploads a video to a Facebook Page.' },
    { id: 'meta-post-group', platform: 'Meta', label: 'Post Video to Group', endpoint: '/api/meta/group/video', method: 'POST', inputs: [{ name: 'video', label: 'Video File', type: 'file' }, { name: 'description', label: 'Description', type: 'textarea' }], description: 'Uploads a video to a Facebook Group you manage.' },
    { id: 'x-post-tweet', platform: 'X (Twitter)', label: 'Post a Tweet', endpoint: '/api/twitter/tweet', method: 'POST', inputs: [{ name: 'text', label: 'Tweet Text', type: 'textarea', placeholder: "What's happening?" }], description: 'Publishes a new tweet to your profile.' },
    { id: 'linkedin-post-profile', platform: 'LinkedIn', label: 'Post to Profile', endpoint: '/api/linkedin/profile/post', method: 'POST', inputs: [{ name: 'text', label: 'Post Content', type: 'textarea' }], description: 'Shares a new post to your LinkedIn profile.' },
    { id: 'tiktok-get-user', platform: 'TikTok', label: 'Fetch User Info', endpoint: '/api/tiktok/user', method: 'GET', inputs: [], description: 'Retrieves basic profile information for the authenticated user.' },
];

const ApiActionTester: React.FC<{ action: ApiAction; onClose: () => void }> = ({ action, onClose }) => {
    const [formState, setFormState] = useState<{ [key: string]: string | File }>({});
    const [response, setResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                setFormState(prev => ({ ...prev, [name]: files[0] }));
            }
        } else {
            setFormState(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleRunAction = async () => {
        setIsLoading(true);
        setResponse(null);
        setError(null);
        
        const platformId = action.platform === 'Meta' ? 'meta' : action.platform === 'X (Twitter)' ? 'x' : action.platform.toLowerCase();
        const token = localStorage.getItem(`${platformId}_jwt`);

        if (!token) {
            setError(`Not connected to ${action.platform}. Please connect in the Branding panel.`);
            setIsLoading(false);
            return;
        }

        const headers: HeadersInit = {
            'Authorization': `Bearer ${token}`
        };

        let body: BodyInit | undefined;

        const hasFileInput = action.inputs.some(input => input.type === 'file');

        if (hasFileInput) {
            const formData = new FormData();
            for (const key in formState) {
                formData.append(key, formState[key]);
            }
            body = formData;
        } else if (action.method === 'POST') {
            body = JSON.stringify(formState);
            headers['Content-Type'] = 'application/json';
        }

        try {
            const res = await fetch(action.endpoint, {
                method: action.method,
                headers,
                body,
            });

            const resData = await res.json();
            
            if (!res.ok) {
                throw new Error(resData.error || `Request failed with status ${res.status}`);
            }

            setResponse(JSON.stringify(resData, null, 2));

        } catch (e) {
            const message = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full max-w-lg relative flex flex-col max-h-[90vh]">
                <h3 className="text-lg font-semibold text-white mb-2">{action.label}</h3>
                <p className="text-sm text-gray-400 mb-1">{action.description}</p>
                <div className="mb-4 text-xs font-mono bg-gray-900 p-2 rounded-md text-gray-400">
                    <span className={`font-bold ${action.method === 'POST' ? 'text-yellow-400' : 'text-green-400'}`}>{action.method}</span>
                    <span className="text-gray-500"> {action.endpoint}</span>
                </div>
                
                <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                    {action.inputs.map(input => (
                        <div key={input.name}>
                            <label htmlFor={input.name} className="block text-sm font-medium text-gray-300 mb-1">{input.label}</label>
                            {input.type === 'textarea' ? (
                                <textarea
                                    id={input.name}
                                    name={input.name}
                                    rows={4}
                                    placeholder={input.placeholder}
                                    onChange={handleInputChange}
                                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                                />
                            ) : (
                                <input
                                    id={input.name}
                                    name={input.name}
                                    type={input.type}
                                    onChange={handleInputChange}
                                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                                />
                            )}
                        </div>
                    ))}

                    {(response || error) && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2">Response</h4>
                            <pre className={`p-3 rounded-md text-xs font-mono overflow-x-auto ${error ? 'bg-red-900/40 text-red-300' : 'bg-green-900/40 text-green-300'}`}>
                                {response || error}
                            </pre>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700/50 flex-shrink-0">
                    <button
                        onClick={handleRunAction}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:bg-gray-500"
                    >
                        {isLoading ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="rocket" className="w-5 h-5" />}
                        <span>{isLoading ? 'Executing...' : 'Run Action'}</span>
                    </button>
                </div>

                <button onClick={onClose} className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-white rounded-full hover:bg-gray-700 transition-colors">
                    <Icon name="x" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const ApiActionCenter: React.FC = () => {
    const [selectedAction, setSelectedAction] = useState<ApiAction | null>(null);

    const groupedActions = apiActions.reduce((acc, action) => {
        if (!acc[action.platform]) {
            acc[action.platform] = [];
        }
        acc[action.platform].push(action);
        return acc;
    }, {} as { [key: string]: ApiAction[] });

    return (
        <div className="p-4 space-y-6">
            {selectedAction && <ApiActionTester action={selectedAction} onClose={() => setSelectedAction(null)} />}
            {Object.entries(groupedActions).map(([platform, actions]) => (
                <div key={platform}>
                    <h3 className="text-md font-semibold text-gray-200 mb-2">{platform}</h3>
                    <div className="space-y-2">
                        {actions.map(action => (
                            <button
                                key={action.id}
                                onClick={() => setSelectedAction(action)}
                                className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <span className="font-medium text-sm text-gray-300">{action.label}</span>
                                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};


const PushContent: React.FC<{
    pushedFeatures: Set<string>;
    onTogglePushFeature: (featureId: string) => void;
}> = ({ pushedFeatures, onTogglePushFeature }) => {
    
    const allDeveloperItems = DEVELOPER_SIDEBAR_ITEMS.filter(
        item => !CLIENT_SIDEBAR_ITEMS.some(clientItem => clientItem.id === item.id)
    );

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-md font-semibold text-gray-200">Push to Client View</h3>
            <p className="text-sm text-gray-400">
                Select developer features to make them available in the Client version of the app.
            </p>
            <div className="space-y-2">
                {allDeveloperItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                             <div className="w-6 h-6 text-brand-400">{item.icon}</div>
                            <span className="font-medium text-gray-300">{item.label}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={pushedFeatures.has(item.id)}
                            onChange={() => onTogglePushFeature(item.id)}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-brand-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ChecklistContent: React.FC = () => {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [testResults, setTestResults] = useState<{ [key: string]: { status: 'idle' | 'testing' | 'success' | 'error'; message?: string } }>({});

    useEffect(() => {
        try {
            const storedState = localStorage.getItem('checklistState');
            if (storedState) {
                setCheckedItems(new Set(JSON.parse(storedState)));
            }
        } catch (error) {
            console.error("Failed to load checklist state from localStorage:", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('checklistState', JSON.stringify(Array.from(checkedItems)));
        } catch (error) {
            console.error("Failed to save checklist state to localStorage:", error);
        }
    }, [checkedItems]);

    const handleToggleCheck = (id: string) => {
        setCheckedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const runTest = useCallback(async (id: string, testFn: () => Promise<string>) => {
        setTestResults(prev => ({ ...prev, [id]: { status: 'testing' } }));
        try {
            const message = await testFn();
            setTestResults(prev => ({ ...prev, [id]: { status: 'success', message } }));
            handleToggleCheck(id); // Auto-check on success
        } catch (error) {
            // FIX: Safely handle the caught error because the 'error' object is of type 'unknown' in a catch block.
            const message = error instanceof Error ? error.message : 'Test failed';
            setTestResults(prev => ({ ...prev, [id]: { status: 'error', message } }));
        }
    }, []);

    const testStatusEndpoint = async () => {
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();
        return data.message || 'OK';
    };

    const testSaveEndpoint = async () => {
        // Find any available token to test the authenticated endpoint
        const platformIds = ['meta', 'x', 'linkedin', 'tiktok'];
        const token = platformIds.reduce<string | null>((foundToken, id) => {
            if (foundToken) return foundToken;
            return localStorage.getItem(`${id}_jwt`);
        }, null);

        if (!token) {
            throw new Error("No connected account found. Cannot test authenticated endpoint.");
        }

        const response = await fetch('/api/save-design', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: 'Test Design', content: '...' }),
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();
        return data.message || 'Saved';
    };

    const testUploadEndpoint = async () => {
        const fakeImageData = new Blob(['(⌐□_□)'], { type: 'image/png' });
        const formData = new FormData();
        formData.append('image_file', fakeImageData, 'test-image.png');

        const response = await fetch('/api/image-upload', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();
        return data.imageUrl || 'Uploaded';
    };
    
    // --- Termux/Mobile Tests ---
    const testOfflineSupport = async () => {
      if ('serviceWorker' in navigator && 'caches' in window) {
        return "Service Worker & Cache API are supported.";
      }
      throw new Error("Offline features may not work; APIs not found.");
    };

    const testTouchEvents = async () => {
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return "Touch events are supported.";
      }
      throw new Error("Device does not report touch support.");
    };
    
    const testPwaManifest = async () => {
      if (document.querySelector('link[rel="manifest"]')) {
        return "Web App Manifest is linked.";
      }
      throw new Error("App is not configured as a PWA (no manifest found).");
    };

    const testNetworkStatus = async () => {
        if ('onLine' in navigator) {
            return `API supported. Status: ${navigator.onLine ? 'Online' : 'Offline'}.`;
        }
        throw new Error("Navigator.onLine API not available.");
    };

    const testFileSystemAccess = async () => {
        if ('showOpenFilePicker' in window) {
          return "File System Access API is supported.";
        }
        throw new Error("File System Access API not supported.");
    };

    const testTermuxApiAccess = async () => {
        throw new Error("Direct Termux API access from browser is not possible due to security restrictions. Use a local WebSocket server for bridging.");
    };


    const frontendItems = [
        { id: 'fe-header', label: 'Header Component' },
        { id: 'fe-sidebar', label: 'Sidebar Navigation' },
        { id: 'fe-canvas', label: 'Canvas & Zoom' },
        { id: 'fe-rightpanel', label: 'Right Panel (Client/Dev)' },
        { id: 'fe-gemini', label: 'Gemini Service Call' },
    ];

    const backendItems = [
        { id: 'be-status', label: 'Server Status Endpoint (/api/status)', testFn: testStatusEndpoint },
        { id: 'be-save', label: 'Save Design Endpoint (/api/save-design)', testFn: testSaveEndpoint },
        { id: 'be-upload', label: 'Image Upload Endpoint (/api/image-upload)', testFn: testUploadEndpoint },
    ];

    const termuxItems = [
        { id: 'termux-offline', label: 'Offline Functionality', testFn: testOfflineSupport },
        { id: 'termux-touch', label: 'Touch Event Support', testFn: testTouchEvents },
        { id: 'termux-pwa', label: 'PWA Manifest Check', testFn: testPwaManifest },
        { id: 'termux-connectivity', label: 'Network Status API', testFn: testNetworkStatus },
        { id: 'termux-fs', label: 'File System Access API', testFn: testFileSystemAccess },
        { id: 'termux-api', label: 'Direct Termux API Access', testFn: testTermuxApiAccess },
    ];
    
    const vercelItems = [
        { id: 'vercel-config', label: 'Vercel Configuration (vercel.json)' },
        { id: 'vercel-env', label: 'Environment variables set in Vercel UI' },
        { id: 'vercel-build-script', label: '`vercel-build` script in package.json' },
        { id: 'vercel-serverless-signature', label: 'Python function uses Vercel handler' },
    ];

    const allTestableItems = useMemo(() => 
        [...backendItems, ...termuxItems].reduce((acc, item) => {
            acc[item.id] = item.label;
            return acc;
        }, {} as Record<string, string>), 
    [backendItems, termuxItems]);

    const renderChecklistItem = (item: { id: string, label: string; testFn?: () => Promise<string> }, isBackend = false) => {
        const isChecked = checkedItems.has(item.id);
        const testStatus = testResults[item.id]?.status || 'idle';
        return (
            <div key={item.id} className="flex items-center justify-between p-2.5 rounded-md bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                <div 
                    className="flex items-center gap-3 cursor-pointer flex-grow"
                    onClick={() => handleToggleCheck(item.id)}
                >
                    <Icon
                        name={isChecked ? 'check-circle' : 'circle'}
                        className={`w-5 h-5 flex-shrink-0 transition-colors ${isChecked ? 'text-green-500' : 'text-gray-600'}`}
                    />
                    <span className={`text-sm font-medium ${isChecked ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                        {item.label}
                    </span>
                </div>
                {item.testFn && (
                    <button
                        onClick={() => runTest(item.id, item.testFn!)}
                        disabled={testStatus === 'testing'}
                        className="text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-md py-1 px-3 transition-colors disabled:bg-gray-600 disabled:cursor-wait"
                    >
                        {testStatus === 'testing' ? (
                            <Icon name="loader" className="w-4 h-4 animate-spin" />
                        ) : testStatus === 'success' ? (
                            <Icon name="check-circle" className="w-4 h-4 text-green-400" />
                        ) : testStatus === 'error' ? (
                            <Icon name="x" className="w-4 h-4 text-red-400" />
                        ) : (
                            'Test'
                        )}
                    </button>
                )}
            </div>
        );
    };

    return (
         <div className="p-4 space-y-6">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-md font-semibold text-gray-200 mb-3">Frontend Components</h3>
                <div className="space-y-2">
                    {frontendItems.map(item => renderChecklistItem(item))}
                </div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-md font-semibold text-gray-200 mb-1">Backend Integration</h3>
                <p className="text-xs text-gray-500 mb-3">Ensure your local Python server is running before testing.</p>
                <div className="space-y-2">
                    {backendItems.map(item => renderChecklistItem(item, true))}
                </div>
                 {Object.entries(testResults).filter(([id]) => allTestableItems[id]).map(([id, result]) => (
                    result.status === 'error' && result.message && (
                        <div key={`${id}-error`} className="mt-2 text-xs p-2 rounded-md bg-red-900/50 text-red-300 font-mono">
                           <strong>Error on {allTestableItems[id]}:</strong> {result.message}
                        </div>
                    )
                ))}
            </div>
             <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-md font-semibold text-gray-200 mb-1">Mobile & Termux Compatibility</h3>
                <p className="text-xs text-gray-500 mb-3">Checks for features relevant in mobile or Termux environments.</p>
                <div className="space-y-2">
                    {termuxItems.map(item => renderChecklistItem(item, true))}
                </div>
                 {Object.entries(testResults).filter(([id]) => allTestableItems[id]).map(([id, result]) => (
                    result.status === 'error' && result.message && (
                        <div key={`${id}-error-termux`} className="mt-2 text-xs p-2 rounded-md bg-red-900/50 text-red-300 font-mono">
                           <strong>Info on {allTestableItems[id]}:</strong> {result.message}
                        </div>
                    )
                ))}
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-md font-semibold text-gray-200 mb-1">Vercel Deployment</h3>
                <p className="text-xs text-gray-500 mb-3">Manual checks for Vercel compatibility.</p>
                <div className="space-y-2">
                    {vercelItems.map(item => renderChecklistItem(item))}
                </div>
            </div>
        </div>
    );
};


const ServerContent: React.FC = () => {
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [visibleTooltip, setVisibleTooltip] = useState<number | null>(null);
    const [jwtSecret, setJwtSecret] = useState<string>('your-super-secret-jwt-key');
    const [isJwtSecretVisible, setIsJwtSecretVisible] = useState<boolean>(false);
    const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string } | null>(null);
    const [logs, setLogs] = useState<string | null>(null);
    const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
    const [isAuthToolsVisible, setIsAuthToolsVisible] = useState(false);

    const handleViewLogs = async () => {
      setIsLoadingLogs(true);
      setLogs(null);
      setTestResult(null);
      
      const platformIds = ['meta', 'x', 'linkedin', 'tiktok'];
      const token = platformIds.reduce<string | null>((foundToken, id) => {
        if (foundToken) return foundToken;
        return localStorage.getItem(`${id}_jwt`);
      }, null);

      if (!token) {
        setLogs("Authentication Error: You must connect at least one platform in the 'Branding' panel to view logs.");
        setIsLoadingLogs(false);
        return;
      }

      try {
        const response = await fetch('/api/logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server responded with ${response.status}`);
        }
        const data = await response.json();
        setLogs(data.logs || "Log file is empty.");
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to fetch logs.";
        setLogs(`Fetch Error: ${message}`);
      } finally {
        setIsLoadingLogs(false);
      }
    };


    const PrepareFilesStepDetails: React.FC = () => (
        <div>
            <p className="font-semibold mb-1 text-gray-200">Prepare Server Files</p>
            <p className="text-gray-400">
                The <code className="text-xs bg-gray-900 p-1 rounded font-mono">server/</code> directory contains the necessary files:
            </p>
            <ul className="list-disc list-inside text-gray-400 my-2 pl-2">
                <li><code className="text-xs bg-gray-900 p-1 rounded font-mono">server_py.txt</code>: The Python server script.</li>
                <li><code className="text-xs bg-gray-900 p-1 rounded font-mono">server_ipynb.txt</code>: An interactive Jupyter Notebook version of the server.</li>
                <li><code className="text-xs bg-gray-900 p-1 rounded font-mono">requirements.txt</code>: Python dependencies.</li>
            </ul>
            <p className="text-gray-400">
                On your local machine, you should rename <code className="text-xs bg-gray-900 p-1 rounded font-mono">server_py.txt</code> to <code className="text-xs bg-gray-900 p-1 rounded font-mono">server.py</code> or <code className="text-xs bg-gray-900 p-1 rounded font-mono">server_ipynb.txt</code> to <code className="text-xs bg-gray-900 p-1 rounded font-mono">server.ipynb</code> before running it.
            </p>
        </div>
    );
    
    const setupSteps = [
        { id: 1, text: "Prepare server files", details: <PrepareFilesStepDetails /> },
        { id: 2, text: "Install dependencies", details: "Navigate to your local server directory and run 'pip install -r requirements.txt' to install Flask and Flask-Cors. You can also run the first code cell in the .ipynb file." },
        { id: 3, text: "Configure environment", details: "The server will run on port 8080 by default. You can set the PORT environment variable to change this. Your JWT_SECRET should be handled as an environment variable in a real application." },
        { id: 4, text: "Start the server", details: "Either run 'python server.py' in your terminal or run all the cells in the 'server.ipynb' notebook. This will start the local development server." },
        { id: 5, text: "Click 'Connect' above", details: "Once the server is running, use the button in the 'Backend Server' panel to establish a connection for the UI." },
    ];

    const handleToggleStep = (stepId: number) => {
        setCompletedSteps(prev => {
            const newSet = new Set(prev);
            if (newSet.has(stepId)) {
                newSet.delete(stepId);
            } else {
                newSet.add(stepId);
            }
            return newSet;
        });
    };
    
    const handleInfoClick = (e: React.MouseEvent, stepId: number) => {
        e.stopPropagation();
        setVisibleTooltip(prev => (prev === stepId ? null : stepId));
    };

    const handleToggleConnection = async () => {
        setTestResult(null);
        if (status === 'connected') {
            setStatus('disconnected');
            return;
        }

        setStatus('connecting');
        try {
            const response = await fetch('/api/status');
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const data = await response.json();
            setStatus('connected');
            setTestResult({ status: 'success', message: data.message || 'Connection successful!' });
        } catch (error) {
            console.error('Connection attempt failed:', error);
            setStatus('disconnected');
            // FIX: Safely handle the caught error because the 'error' object is of type 'unknown' in a catch block.
            let message = 'Connection failed. Is the server running?';
            if (error instanceof Error) {
                message = error.message;
            }
            
            // @ts-ignore
            if (window.aistudio && message.toLowerCase().includes('status: 404')) {
                message = 'Connection failed. Note: Local server is not accessible from AI Studio.';
            }
            setTestResult({ status: 'error', message });
        } finally {
            setTimeout(() => setTestResult(null), 5000);
        }
    };

    const handleTestConnection = async () => {
        setTestResult({ status: 'testing', message: 'Pinging server...' });
        try {
            const response = await fetch('/api/status');
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const data = await response.json();
            setTestResult({ status: 'success', message: data.message || 'Successfully connected!' });
        } catch (error) {
            console.error('Connection test failed:', error);
            // FIX: Safely handle the caught error because the 'error' object is of type 'unknown' in a catch block.
            let message = 'Connection failed. Is the server running?';
            if (error instanceof Error) {
                message = error.message;
            }
            
            // @ts-ignore
            if (window.aistudio && message.toLowerCase().includes('status: 404')) {
                message = 'Connection failed. Note: Local server is not accessible from AI Studio.';
            }
            setTestResult({ status: 'error', message });
        } finally {
            setTimeout(() => setTestResult(null), 5000); // Clear message after 5 seconds
        }
    };
    
    const isConnected = status === 'connected';
    const isConnecting = status === 'connecting';

    return (
        <div className="p-4 space-y-6">
             <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-md font-semibold text-gray-200 mb-3">Backend Server (Python/Flask)</h3>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-md">
                    <span className="text-sm font-medium text-gray-300">Status</span>
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full transition-colors ${isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-semibold ${isConnected ? 'text-green-400' : isConnecting ? 'text-yellow-400' : 'text-red-400'}`}>
                            {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <label htmlFor="jwt-secret" className="block text-sm font-medium text-gray-300 mb-1">
                        JWT Secret
                    </label>
                    <div className="relative">
                        <input
                            id="jwt-secret"
                            type={isJwtSecretVisible ? 'text' : 'password'}
                            value={jwtSecret}
                            onChange={(e) => setJwtSecret(e.target.value)}
                            className="w-full p-2 pr-10 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition font-mono text-sm"
                            placeholder="Enter your JWT secret"
                            aria-label="JWT Secret"
                        />
                        <button
                            type="button"
                            onClick={() => setIsJwtSecretVisible(!isJwtSecretVisible)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white rounded-md"
                            aria-label={isJwtSecretVisible ? 'Hide JWT secret' : 'Show JWT secret'}
                        >
                            <Icon name="eye" className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleToggleConnection}
                    disabled={isConnecting}
                    className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed ${
                        isConnected 
                        ? 'bg-red-900/60 hover:bg-red-800/70 text-red-300' 
                        : 'bg-brand-600 hover:bg-brand-500 text-white disabled:bg-gray-500'
                    }`}
                >
                    {isConnecting ? (
                        <Icon name="loader" className="w-5 h-5 animate-spin" />
                    ) : isConnected ? (
                       <Icon name="x" className="w-5 h-5" />
                    ) : (
                       <Icon name="connect" className="w-5 h-5" />
                    )}
                    <span>{isConnecting ? 'Connecting' : isConnected ? 'Disconnect' : 'Connect'}</span>
                </button>
                <button
                    onClick={handleTestConnection}
                    disabled={!isConnected || isConnecting || testResult?.status === 'testing'}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors border border-gray-600 hover:bg-gray-700 text-gray-300 disabled:bg-gray-800/50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-700"
                >
                    <Icon name="sparkles" className="w-5 h-5" />
                    <span>{testResult?.status === 'testing' ? 'Testing...' : 'Test Connection'}</span>
                </button>

                 <button
                    onClick={handleViewLogs}
                    disabled={isLoadingLogs}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors border border-gray-600 hover:bg-gray-700 text-gray-300 disabled:bg-gray-800/50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-700"
                >
                    <Icon name="clipboard-list" className="w-5 h-5" />
                    <span>{isLoadingLogs ? 'Loading Logs...' : 'View Server Logs'}</span>
                </button>

                <button
                    onClick={() => setIsAuthToolsVisible(!isAuthToolsVisible)}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors border border-gray-600 hover:bg-gray-700 text-gray-300"
                >
                    <Icon name="users" className="w-5 h-5" />
                    <span>{isAuthToolsVisible ? 'Hide' : 'Show'} Auth Tools</span>
                </button>

                {testResult && (
                    <div className={`mt-3 p-2 text-center text-sm rounded-md animate-fade-in ${
                        testResult.status === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                    }`}>
                        {testResult.message}
                    </div>
                )}
             </div>

            {isAuthToolsVisible && (
              <div className="animate-fade-in">
                <PlatformAuthTools />
              </div>
            )}
             
            {logs && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Logs</h4>
                    <pre className="p-3 rounded-md text-xs font-mono overflow-y-auto max-h-80 bg-gray-900 border border-gray-700/80">
                        {logs}
                    </pre>
                </div>
            )}

             <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-md font-semibold text-gray-200 mb-3">Local Setup Guide</h3>
                 <div className="space-y-2">
                    {setupSteps.map(step => (
                        <div key={step.id} className="relative group">
                            <div 
                                className="flex items-center justify-between p-2.5 rounded-md bg-gray-900/50 hover:bg-gray-800/50 transition-colors cursor-pointer"
                                onClick={() => handleToggleStep(step.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon
                                        name={completedSteps.has(step.id) ? 'check-circle' : 'circle'}
                                        className={`w-5 h-5 flex-shrink-0 transition-colors ${completedSteps.has(step.id) ? 'text-green-500' : 'text-gray-600'}`}
                                    />
                                    <span className={`text-sm font-medium ${completedSteps.has(step.id) ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                                        {step.text}
                                    </span>
                                </div>
                                 <button onClick={(e) => handleInfoClick(e, step.id)} className="p-1 rounded-full text-gray-500 hover:bg-gray-700 hover:text-white z-20">
                                    <Icon name="info" className="w-4 h-4" />
                                </button>
                            </div>
                            {visibleTooltip === step.id && (
                                <div className="absolute left-0 right-0 top-full mt-1 p-3 text-xs bg-gray-900 border border-gray-600 rounded-lg shadow-lg z-10 animate-fade-in">
                                    {typeof step.details === 'string' ? <p>{step.details}</p> : step.details}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
             </div>
        </div>
    );
};


const ContentPanel: React.FC<ContentPanelProps> = ({ activeItem, onClose, version, pushedFeatures, onTogglePushFeature, onAddElement }) => {
  const contentMap: { [key: string]: React.ReactNode } = {
    templates: <TemplatesContent />,
    text: <TextContent onAddElement={onAddElement} />,
    images: <ImagesContent />,
    shapes: <ShapesContent onAddElement={onAddElement} />,
    planner: <ContentPlanner />,
    ai: <AiSuggestContent />,
    branding: <BrandingContent />,
    collaboration: <CollaborationContent />,
    'version-control': <VersionControlContent />,
    integrations: <IntegrationsContent />,
    server: <ServerContent />,
    checklist: <ChecklistContent />,
    push: <PushContent pushedFeatures={pushedFeatures} onTogglePushFeature={onTogglePushFeature} />,
  };
  
  const { label } = [...DEVELOPER_SIDEBAR_ITEMS, ...CLIENT_SIDEBAR_ITEMS].find(item => item.id === activeItem) || { label: 'Panel' };

  return (
    <aside className="w-96 bg-gray-900 border-r border-gray-700/50 flex flex-col flex-shrink-0 animate-slide-in-left">
      <header className="flex items-center justify-between p-3 border-b border-gray-700/50 h-16 flex-shrink-0">
        <h2 className="text-lg font-semibold">{label}</h2>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors">
          <Icon name="x" className="w-5 h-5" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto">
        {contentMap[activeItem] || <div className="p-4">Content not found.</div>}
      </div>
    </aside>
  );
};

export default ContentPanel;