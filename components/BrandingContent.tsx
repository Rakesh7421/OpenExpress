import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Icon } from './common/Icon';
import { AppConfig, initialAppConfig } from '../config/appConfig';
import WalkthroughModal from './WalkthroughModal'; // Import the new modal component

type Status = 'idle' | 'loading' | 'success' | 'error' | 'warning';
type Stage = 'dev' | 'live';
export type PlatformName = 'Facebook' | 'Instagram' | 'Pinterest';

const PLATFORMS: PlatformName[] = ['Facebook', 'Instagram', 'Pinterest'];

// --- Helper Components ---

const StatusIndicator: React.FC<{ status: Status; message?: string }> = ({ status, message }) => {
    const icons: Record<Status, React.ReactNode> = {
        idle: <Icon name="circle" className="w-4 h-4 text-gray-500" title="Idle" />,
        loading: <Icon name="loader" className="w-4 h-4 animate-spin text-blue-400" title="Loading..." />,
        success: <Icon name="check-circle" className="w-4 h-4 text-green-500" title={message || 'Success'} />,
        error: <Icon name="x" className="w-4 h-4 text-red-500" title={message || 'Error'} />,
        warning: <Icon name="info" className="w-4 h-4 text-yellow-500" title={message || 'Warning'} />,
    };
    return <div className="h-5 flex items-center">{icons[status]}</div>;
};

const ConfigInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; isTextarea?: boolean, placeholder?:string }> = ({ label, value, onChange, type = 'text', isTextarea = false, placeholder }) => (
    <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
        {isTextarea ? (
            <textarea value={value} onChange={onChange} rows={3} className="w-full p-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition font-mono text-xs" placeholder={placeholder} />
        ) : (
            <input type={type} value={value} onChange={onChange} className="w-full p-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition font-mono text-xs" placeholder={placeholder}/>
        )}
    </div>
);


// --- Main Component ---

const BrandingContent: React.FC = () => {
    const [appConfig, setAppConfig] = useState<AppConfig>(initialAppConfig);
    
    // --- Context Selection State ---
    const [currentUser, setCurrentUser] = useState(appConfig.current_selection.user);
    const [currentBrand, setCurrentBrand] = useState(appConfig.current_selection.brand);
    const [currentStage, setCurrentStage] = useState<Stage>('dev');
    
    // --- UI State ---
    const [activePlatform, setActivePlatform] = useState<PlatformName>('Facebook');
    const [validationStatus, setValidationStatus] = useState<{ status: Status, message: string }>({ status: 'idle', message: '' });
    const [scopeTestResult, setScopeTestResult] = useState<{ scope: string, status: 'Granted' | 'Missing' }[] | null>(null);
    const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);

    // Memoize the current configuration based on selections
    const currentBrandDetails = useMemo(() => {
        return appConfig.users[currentUser]?.brands[currentBrand]?.details;
    }, [appConfig, currentUser, currentBrand]);

    const currentPlatformConfig = useMemo(() => {
        return appConfig.users[currentUser]?.brands[currentBrand]?.platforms?.[activePlatform]?.[currentStage];
    }, [appConfig, currentUser, currentBrand, activePlatform, currentStage]);


    const handleConfigChange = useCallback((fieldPath: string, value: string) => {
        setAppConfig(prevConfig => {
            const newConfig = JSON.parse(JSON.stringify(prevConfig)); // Deep copy
            const keys = fieldPath.split('.');
            let current = newConfig.users[currentUser].brands[currentBrand];
            
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newConfig;
        });
    }, [currentUser, currentBrand]);

    // Effect to listen for auth tokens from popup - now updates the main config state
    useEffect(() => {
        const handleAuthMessage = (event: MessageEvent) => {
            const { type, platform, token } = event.data;
            if (type === 'auth-success' && token) {
                console.log(`Received token for ${platform}:`, token);
                
                localStorage.setItem(`${platform}_jwt`, token);
                
                handleConfigChange(`platforms.${activePlatform}.${currentStage}.tokens.user`, 'Received_From_OAuth_Flow_See_JWT_In_LocalStorage');

                setValidationStatus({ status: 'success', message: `Successfully connected to ${platform}! Token received.` });

            } else if (type === 'auth-failure') {
                 setValidationStatus({ status: 'error', message: `Authentication failed for ${platform}. Check server logs.` });
            }
        };
        window.addEventListener('message', handleAuthMessage);
        return () => window.removeEventListener('message', handleAuthMessage);
    }, [activePlatform, currentStage, handleConfigChange]);


    const handleConnect = () => {
        if (!currentPlatformConfig) {
            alert("Configuration not found for the selected context.");
            return;
        }

        const { app_id } = currentPlatformConfig.credentials;
        const { redirect_uri } = currentPlatformConfig.oauth;

        if (!app_id || !redirect_uri) {
            alert('App ID and Redirect URI must be configured before connecting.');
            return;
        }
        
        const platformMap: Record<string, string> = {
            Facebook: 'facebook',
            Instagram: 'facebook', 
            Pinterest: 'pinterest'
        };
        const authProvider = platformMap[activePlatform];
        
        if (!authProvider) {
            alert(`Authentication provider for ${activePlatform} is not configured.`);
            return;
        }

        const authUrl = `http://localhost:8080/auth/${authProvider}`;
        window.open(authUrl, '_blank', 'width=600,height=700');
    };

    const handleValidateTokens = async () => {
        if (!currentPlatformConfig || activePlatform !== 'Facebook') {
            setValidationStatus({ status: 'warning', message: 'Validation is only available for Facebook.' });
            return;
        }
        setValidationStatus({ status: 'loading', message: 'Validating tokens...' });

        const { app_id, app_secret, page_id } = currentPlatformConfig.credentials;
        const { user: user_token, page: page_token } = currentPlatformConfig.tokens;

        try {
            if (user_token && app_id && app_secret) {
                const appAccessToken = `${app_id}|${app_secret}`;
                const debugUrl = `https://graph.facebook.com/debug_token?input_token=${user_token}&access_token=${appAccessToken}`;
                const res = await fetch(debugUrl);
                const data = await res.json();
                if (!res.ok || data.error || !data.data?.is_valid) {
                    throw new Error(`User Token is invalid: ${data.error?.message || 'Validation failed.'}`);
                }
            } else {
                 throw new Error('User token, App ID, or App Secret is missing.');
            }

            if (page_token && page_id) {
                const pageUrl = `https://graph.facebook.com/${page_id}?fields=name&access_token=${page_token}`;
                const pageRes = await fetch(pageUrl);
                const pageData = await pageRes.json();
                 if (!pageRes.ok || pageData.error) {
                    throw new Error(`Page Token is invalid for Page ID ${page_id}: ${pageData.error?.message || 'Validation failed.'}`);
                }
            }
             
            setValidationStatus({ status: 'success', message: 'User and Page tokens are valid!' });

        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown validation error occurred.";
            setValidationStatus({ status: 'error', message });
        }
    };
    
    const handleTestScopes = async () => {
        if (!currentPlatformConfig || activePlatform !== 'Facebook' || !currentPlatformConfig.tokens.user) {
            setValidationStatus({ status: 'warning', message: 'User Token is required to test scopes.' });
            return;
        }
        setValidationStatus({ status: 'loading', message: 'Testing scopes...' });
        setScopeTestResult(null);

        const { app_id, app_secret } = currentPlatformConfig.credentials;
        const { user: user_token } = currentPlatformConfig.tokens;
        const required_scopes = currentPlatformConfig.oauth.scopes;

        try {
            const appAccessToken = `${app_id}|${app_secret}`;
            const debugUrl = `https://graph.facebook.com/debug_token?input_token=${user_token}&access_token=${appAccessToken}`;
            const res = await fetch(debugUrl);
            const data = await res.json();
            
            if (!res.ok || data.error || !data.data?.is_valid) {
                throw new Error(`Token is invalid: ${data.error?.message || 'Validation failed.'}`);
            }

            const grantedScopes = new Set(data.data.scopes || []);
            const requiredScopesList = required_scopes.split(',').map(s => s.trim()).filter(Boolean);

            const result: { scope: string; status: 'Granted' | 'Missing' }[] = requiredScopesList.map(scope => ({
                scope,
                status: grantedScopes.has(scope) ? 'Granted' : 'Missing'
            }));
            
            setScopeTestResult(result);
            setValidationStatus({ status: 'success', message: 'Scope test complete.' });

        } catch (error) {
             const message = error instanceof Error ? error.message : "An unknown error occurred.";
             setValidationStatus({ status: 'error', message });
        }
    };
    
    const getLabelForKey = (key: string): string => {
      const labels: Record<string, string> = {
        app_id: 'App ID',
        app_secret: 'App Secret',
        page_id: 'Page ID',
        group_id: 'Group ID',
        consumer_key: 'Consumer Key',
        consumer_secret: 'Consumer Secret',
        user: 'User Token',
        page: 'Page Token',
        access_token: 'Access Token',
        access_token_secret: 'Access Token Secret',
      };
      return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="p-4 space-y-6 text-gray-300">
            {isWalkthroughOpen && (
                <WalkthroughModal 
                    platform={activePlatform} 
                    onClose={() => setIsWalkthroughOpen(false)} 
                />
            )}

            {/* --- Context --- */}
            <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-md font-semibold text-gray-200">Configuration Context</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">User</label>
                        <select value={currentUser} onChange={e => setCurrentUser(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm">
                            {Object.keys(appConfig.users).map(user => <option key={user} value={user}>{user}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Brand</label>
                        <select value={currentBrand} onChange={e => setCurrentBrand(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm">
                            {Object.keys(appConfig.users[currentUser]?.brands || {}).map(brand => <option key={brand} value={brand}>{brand || '[No Brand]'}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="flex items-center p-1 bg-gray-900 rounded-full border border-gray-600">
                    <button onClick={() => setCurrentStage('dev')} className={`w-full px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-300 ${currentStage === 'dev' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                        Dev
                    </button>
                    <button onClick={() => setCurrentStage('live')} className={`w-full px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-300 ${currentStage === 'live' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                        Live
                    </button>
                </div>
            </div>

            {/* --- Brand Details --- */}
             <details className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <summary className="text-md font-semibold cursor-pointer">Brand Details</summary>
                <div className="mt-3 pt-3 border-t border-gray-700 space-y-3">
                    <ConfigInput label="Brand Name" value={currentBrandDetails?.name || ''} onChange={e => handleConfigChange('details.name', e.target.value)} />
                    <ConfigInput label="Logo URL" value={currentBrandDetails?.logoUrl || ''} onChange={e => handleConfigChange('details.logoUrl', e.target.value)} placeholder="https://..." />
                    {currentBrandDetails?.logoUrl && (
                        <div>
                             <img src={currentBrandDetails.logoUrl} alt="Brand Logo Preview" className="w-16 h-16 rounded-md object-contain bg-white p-1" />
                        </div>
                    )}
                    <ConfigInput label="Description" value={currentBrandDetails?.description || ''} onChange={e => handleConfigChange('details.description', e.target.value)} isTextarea />
                </div>
            </details>

            {/* --- Platform Tabs --- */}
            <div>
                <div className="flex border-b border-gray-700">
                    {PLATFORMS.map(platform => (
                        <button key={platform} onClick={() => setActivePlatform(platform)} className={`px-4 py-2 text-sm font-medium transition-colors ${activePlatform === platform ? 'border-b-2 border-brand-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
                            {platform}
                        </button>
                    ))}
                </div>

                {/* --- Configuration Form --- */}
                {currentPlatformConfig ? (
                    <div className="mt-4 space-y-4 animate-fade-in">
                        <details className="p-3 bg-gray-800/50 rounded-lg border border-gray-700" open>
                            <summary className="text-sm font-semibold cursor-pointer flex justify-between items-center">
                                <span>Credentials</span>
                                <button
                                    onClick={(e) => { e.preventDefault(); setIsWalkthroughOpen(true); }}
                                    className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 rounded-md transition-colors"
                                >
                                    <Icon name="info" className="w-3 h-3" />
                                    Info
                                </button>
                            </summary>
                            <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-2 gap-3">
                                {Object.entries(currentPlatformConfig.credentials).map(([key, value]) => (
                                    <ConfigInput 
                                        key={key}
                                        label={getLabelForKey(key)} 
                                        value={value} 
                                        onChange={e => handleConfigChange(`platforms.${activePlatform}.${currentStage}.credentials.${key}`, e.target.value)} 
                                        type={key.includes('secret') ? 'password' : 'text'}
                                    />
                                ))}
                            </div>
                        </details>
                        <details className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <summary className="text-sm font-semibold cursor-pointer">Tokens</summary>
                             <div className="mt-3 pt-3 border-t border-gray-700 space-y-3">
                                {Object.entries(currentPlatformConfig.tokens).map(([key, value]) => (
                                     <ConfigInput 
                                        key={key}
                                        label={getLabelForKey(key)} 
                                        value={value} 
                                        onChange={e => handleConfigChange(`platforms.${activePlatform}.${currentStage}.tokens.${key}`, e.target.value)} 
                                        isTextarea 
                                    />
                                ))}
                            </div>
                        </details>
                        <details className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <summary className="text-sm font-semibold cursor-pointer">OAuth</summary>
                            <div className="mt-3 pt-3 border-t border-gray-700 space-y-3">
                                {currentStage === 'live' && currentPlatformConfig.oauth.redirect_uri.includes('localhost') && (
                                    <div className="p-2 text-xs bg-yellow-900/50 text-yellow-300 border border-yellow-700 rounded-md flex items-center gap-2">
                                        <Icon name="info" className="w-4 h-4 flex-shrink-0" />
                                        <span>Live mode requires a public Redirect URI, not localhost.</span>
                                    </div>
                                )}
                                <ConfigInput label="Redirect URI" value={currentPlatformConfig.oauth.redirect_uri} onChange={e => handleConfigChange(`platforms.${activePlatform}.${currentStage}.oauth.redirect_uri`, e.target.value)} />
                                <ConfigInput label="Scopes" value={currentPlatformConfig.oauth.scopes} onChange={e => handleConfigChange(`platforms.${activePlatform}.${currentStage}.oauth.scopes`, e.target.value)} isTextarea placeholder="e.g., pages_manage_posts,publish_video" />
                            </div>
                        </details>
                        
                        {/* --- Actions --- */}
                        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3">
                             <h4 className="text-sm font-semibold">Actions</h4>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Connect account via OAuth:</p>
                                <button onClick={handleConnect} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors">
                                    <Icon name="connect" className="w-4 h-4" /> Connect Account
                                </button>
                            </div>
                             <div className="flex items-center justify-between">
                                <p className="text-sm">Validate stored tokens:</p>
                                <button onClick={handleValidateTokens} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">
                                    <Icon name="check-circle" className="w-4 h-4" /> Validate Tokens
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Test configured scopes:</p>
                                <button onClick={handleTestScopes} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">
                                    <Icon name="checklist" className="w-4 h-4" /> Test Scopes
                                </button>
                            </div>
                             {validationStatus.status !== 'idle' && (
                                <div className={`mt-2 p-2 text-xs rounded-md flex items-start gap-2 ${validationStatus.status === 'success' ? 'bg-green-900/50 text-green-300' : validationStatus.status === 'warning' ? 'bg-yellow-900/50 text-yellow-300' : validationStatus.status === 'error' ? 'bg-red-900/50 text-red-300' : 'bg-blue-900/50 text-blue-300'}`}>
                                    <StatusIndicator status={validationStatus.status} />
                                    <span className="flex-1 break-words">{validationStatus.message}</span>
                                </div>
                            )}
                            {scopeTestResult && (
                                <div className="mt-2 p-2 text-xs rounded-md bg-gray-900/50 border border-gray-700 max-h-40 overflow-y-auto">
                                    <h5 className="font-bold mb-1">Scope Analysis:</h5>
                                    {scopeTestResult.map(res => (
                                        <div key={res.scope} className={`flex items-center justify-between ${res.status === 'Missing' ? 'text-red-400' : 'text-green-400'}`}>
                                            <span className="font-mono">{res.scope}</span>
                                            <span>{res.status === 'Granted' ? '✅' : '❌'} {res.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 p-4 text-center text-gray-500">
                        <p>No configuration found for {currentUser} / {currentBrand} / {activePlatform}.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandingContent;