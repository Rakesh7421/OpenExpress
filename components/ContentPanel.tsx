import React, { useState, useEffect, useCallback } from 'react';
import { AppVersion } from '../types';
import { Icon } from './common/Icon';
import { DEVELOPER_SIDEBAR_ITEMS, CLIENT_SIDEBAR_ITEMS } from '../constants';

interface ContentPanelProps {
  activeItem: string;
  onClose: () => void;
  version: AppVersion;
  pushedFeatures: Set<string>;
  onTogglePushFeature: (featureId: string) => void;
}

// Authentication Modal Component (reusable for integrations and branding)
const AuthModal: React.FC<{
  platform: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ platform, onClose, onSuccess }) => {
    const [authStep, setAuthStep] = useState<'redirecting' | 'success'>('redirecting');
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAuthStep('success');
        }, 2500); // Simulate API call and redirect
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (authStep === 'success') {
            const countdownTimer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownTimer);
                        onSuccess();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(countdownTimer);
        }
    }, [authStep, onSuccess]);


    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-96 relative">
          <h3 className="text-lg font-semibold text-white mb-6 text-center">Authenticating with {platform}</h3>
          
          {authStep === 'redirecting' && (
            <div className="flex flex-col items-center gap-4 text-gray-300">
              <Icon name="loader" className="w-8 h-8 animate-spin text-brand-400" />
              <p className="text-sm">Simulating redirection for authorization...</p>
            </div>
          )}
          
          {authStep === 'success' && (
            <div className="text-center">
              <Icon name="check-circle" className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-200 font-semibold">Authentication Successful!</p>
              <p className="text-sm text-gray-400 mt-2">
                You have successfully connected your {platform} account. Closing in {countdown}s.
              </p>
            </div>
          )}

          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-white rounded-full hover:bg-gray-700 transition-colors">
            <Icon name="x" className="w-4 h-4" />
          </button>
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
            // FIX: Safely access message property from 'unknown' error type.
            const message = error instanceof Error ? error.message : 'Test failed';
            setTestResults(prev => ({ ...prev, [id]: { status: 'error', message } }));
        }
    }, []);

    const testStatusEndpoint = async () => {
        const response = await fetch('http://localhost:8080/');
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();
        return data.message || 'OK';
    };

    const testSaveEndpoint = async () => {
        const response = await fetch('http://localhost:8080/api/save-design', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Test Design', content: '...' }),
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();
        return data.message || 'Saved';
    };

    const frontendItems = [
        { id: 'fe-header', label: 'Header Component' },
        { id: 'fe-sidebar', label: 'Sidebar Navigation' },
        { id: 'fe-canvas', label: 'Canvas & Zoom' },
        { id: 'fe-rightpanel', label: 'Right Panel (Client/Dev)' },
        { id: 'fe-gemini', label: 'Gemini Service Call' },
    ];

    const backendItems = [
        { id: 'be-status', label: 'Server Status Endpoint (/)', testFn: testStatusEndpoint },
        { id: 'be-save', label: 'Save Design Endpoint (/api/save-design)', testFn: testSaveEndpoint },
    ];

    const renderChecklistItem = (item: { id: string, label: string }, isBackend = false) => {
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
                {isBackend && (
                    <button
                        onClick={() => runTest(item.id, (item as any).testFn)}
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
                 {Object.entries(testResults).map(([id, result]) => (
                    result.status === 'error' && result.message && (
                        <div key={`${id}-error`} className="mt-2 text-xs p-2 rounded-md bg-red-900/50 text-red-300 font-mono">
                           <strong>Error on {backendItems.find(i => i.id === id)?.label}:</strong> {result.message}
                        </div>
                    )
                ))}
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

    const PrepareFilesStepDetails: React.FC = () => (
        <div>
            <p className="font-semibold mb-1 text-gray-200">Prepare Server Files</p>
            <p className="text-gray-400">
                The <code className="text-xs bg-gray-900 p-1 rounded font-mono">server/</code> directory contains the necessary files:
            </p>
            <ul className="list-disc list-inside text-gray-400 my-2 pl-2">
                <li><code className="text-xs bg-gray-900 p-1 rounded font-mono">server_py.txt</code>: The Python server code.</li>
                <li><code className="text-xs bg-gray-900 p-1 rounded font-mono">requirements.txt</code>: Python dependencies.</li>
            </ul>
            <p className="text-gray-400">
                On your local machine, you should rename <code className="text-xs bg-gray-900 p-1 rounded font-mono">server_py.txt</code> to <code className="text-xs bg-gray-900 p-1 rounded font-mono">server.py</code> before running it.
            </p>
        </div>
    );
    
    const setupSteps = [
        { id: 1, text: "Prepare server files", details: <PrepareFilesStepDetails /> },
        { id: 2, text: "Install dependencies", details: "Navigate to your local server directory and run 'pip install -r requirements.txt' to install Flask and Flask-Cors." },
        { id: 3, text: "Configure environment", details: "The server will run on port 8080 by default. You can set the PORT environment variable to change this. Your JWT_SECRET should be handled as an environment variable in a real application." },
        { id: 4, text: "Start the server", details: "Run 'python server.py' in your server's directory. It will start a local development server." },
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

    const handleToggleConnection = () => {
        setTestResult(null); // Clear test results on connect/disconnect
        if (status === 'connected') {
            setStatus('disconnected');
        } else if (status === 'disconnected') {
            setStatus('connecting');
            setTimeout(() => {
                setStatus('connected');
            }, 1500);
        }
    };

    const handleTestConnection = async () => {
        setTestResult({ status: 'testing', message: 'Pinging server...' });
        try {
            const response = await fetch('http://localhost:8080/');
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const data = await response.json();
            setTestResult({ status: 'success', message: data.message || 'Successfully connected!' });
        } catch (error) {
            console.error('Connection test failed:', error);
            setTestResult({ status: 'error', message: 'Connection failed. Is the server running?' });
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
                        <div className={`w-2.5 h-2.5 rounded-full transition-colors ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-semibold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
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

                {testResult && testResult.status !== 'idle' && (
                    <div className={`mt-3 text-center text-xs p-2 rounded-md transition-opacity duration-300 ${
                        testResult.status === 'testing' ? 'opacity-50' : 'opacity-100'
                    } ${
                        testResult.status === 'success' ? 'bg-green-900/50 text-green-300' : 
                        testResult.status === 'error' ? 'bg-red-900/50 text-red-300' :
                        'bg-gray-700/50 text-gray-400'
                    }`}>
                        {testResult.message}
                    </div>
                )}
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-md font-semibold text-gray-200 mb-3 flex items-center gap-2">
                   <Icon name="clipboard-list" className="w-5 h-5 text-brand-400" />
                   Setup Guide & To-Do
                </h3>
                <ul className="space-y-1">
                    {setupSteps.map(step => {
                        const isCompleted = completedSteps.has(step.id);
                        return (
                            <div key={step.id} className="relative">
                                <div 
                                    onClick={() => handleToggleStep(step.id)}
                                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-900/50 transition-colors"
                                >
                                    <button
                                        onClick={(e) => handleInfoClick(e, step.id)}
                                        className="p-1 text-gray-500 hover:text-brand-400 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 z-10 -ml-1"
                                        aria-label={`More info for ${step.text}`}
                                    >
                                        <Icon name="info" className="w-5 h-5" />
                                    </button>
                                    <Icon 
                                        name={isCompleted ? 'check-circle' : 'circle'} 
                                        className={`w-6 h-6 flex-shrink-0 transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-600'}`}
                                    />
                                    <span className={`text-sm transition-colors ${isCompleted ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                                        {step.text}
                                    </span>
                                </div>
                                {visibleTooltip === step.id && (
                                    <div className="absolute left-6 top-full -mt-1 w-64 p-3 bg-gray-950 text-xs text-gray-300 rounded-md shadow-lg z-20 border border-gray-700/80">
                                        {typeof step.details === 'string' ? (
                                            <>
                                                <p className="font-semibold mb-1 text-gray-200">Instructions:</p>
                                                {step.details}
                                            </>
                                        ) : (
                                            step.details
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </ul>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-md font-semibold text-gray-200 mb-3 flex items-center gap-2">
                   <Icon name="info" className="w-5 h-5 text-brand-400" />
                   Development Notes
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                    For developers on a host system with the username <code className="text-xs bg-gray-900 p-1 rounded font-mono">tempo</code> or <code className="text-xs bg-gray-900 p-1 rounded font-mono">TEMPO</code>, please ensure your node modules path ("nod models patch") is set to:
                    <br />
                    <code className="block mt-2 text-xs bg-gray-900 p-2 rounded font-mono break-all">D:\installer_files\node_modules\OpenExpress</code>
                </p>
                 <p className="text-xs text-gray-500 mt-3">
                    This is a special instruction based on your system configuration.
                </p>
            </div>
        </div>
    );
};

const PushContent: React.FC<{pushedFeatures: Set<string>, onToggle: (featureId: string) => void}> = ({ pushedFeatures, onToggle }) => {
    const developerOnlyFeatures = DEVELOPER_SIDEBAR_ITEMS.filter(item => 
        !CLIENT_SIDEBAR_ITEMS.some(clientItem => clientItem.id === item.id) && !['push', 'server', 'checklist'].includes(item.id)
    );
    
    return (
        <div className="p-4 space-y-4">
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-md font-semibold text-gray-200 mb-1">Push Features to Client</h3>
                <p className="text-sm text-gray-400 mb-4">Select which advanced features should be available in the Client version.</p>
                <div className="space-y-2">
                    {developerOnlyFeatures.map(feature => (
                        <div key={feature.id} className="flex items-center justify-between p-2 rounded-md bg-gray-900/50 hover:bg-gray-800/50">
                            <div className="flex items-center gap-3">
                                <span className="w-5 h-5 text-gray-400">{feature.icon}</span>
                                <span className="text-sm font-medium text-gray-300">{feature.label}</span>
                            </div>
                            <label htmlFor={`push-${feature.id}`} className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id={`push-${feature.id}`} 
                                    className="sr-only peer"
                                    checked={pushedFeatures.has(feature.id)}
                                    onChange={() => onToggle(feature.id)}
                                />
                                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const IntegrationsContent: React.FC = () => {
    const integrations = [
        { name: 'Google Drive', icon: 'drive', description: 'Access your files' },
        { name: 'Slack', icon: 'slack', description: 'Share with your team' },
        { name: 'Figma', icon: 'figma', description: 'Import design files' },
        { name: 'Dropbox', icon: 'dropbox', description: 'Sync your assets' },
    ];
    
    const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'disconnected' | 'authenticating' | 'connected'}>({});
    const [authIntegration, setAuthIntegration] = useState<string | null>(null);

    const handleConnect = (name: string) => {
        setConnectionStatus(prev => ({ ...prev, [name]: 'authenticating' }));
        setAuthIntegration(name);
    };

    const handleDisconnect = (name: string) => {
        setConnectionStatus(prev => ({ ...prev, [name]: 'disconnected' }));
    };

    const handleAuthSuccess = (name: string) => {
        setConnectionStatus(prev => ({...prev, [name]: 'connected' }));
        setAuthIntegration(null);
    };
    
    const handleAuthCancel = (name: string) => {
        setConnectionStatus(prev => ({...prev, [name]: 'disconnected' }));
        setAuthIntegration(null);
    };

    return (
        <div className="p-4 space-y-4">
             {authIntegration && (
                <AuthModal 
                    platform={authIntegration}
                    onClose={() => handleAuthCancel(authIntegration)}
                    onSuccess={() => handleAuthSuccess(authIntegration)}
                />
            )}
            <input type="search" placeholder="Search integrations..." className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition" />
            <div className="grid grid-cols-2 gap-2">
                {integrations.map(int => {
                    const status = connectionStatus[int.name] || 'disconnected';
                    const isAuthenticating = status === 'authenticating';
                    const isConnected = status === 'connected';
                    return (
                        <div key={int.name} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 space-y-2 flex flex-col items-center text-center hover:bg-gray-800 transition-colors">
                            <Icon name={int.icon} className="w-10 h-10 text-gray-300 mb-2" />
                            <h4 className="text-sm font-semibold text-gray-100">{int.name}</h4>
                            <p className="text-xs text-gray-400 flex-grow">{int.description}</p>
                            <button 
                                onClick={() => isConnected ? handleDisconnect(int.name) : handleConnect(int.name)}
                                disabled={isAuthenticating}
                                className={`w-full mt-2 text-xs font-semibold rounded-md py-1.5 transition-colors flex items-center justify-center gap-1 disabled:cursor-not-allowed ${
                                    isConnected
                                    ? 'bg-green-900/60 hover:bg-green-800/70 text-green-300'
                                    : 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-600'
                                }`}
                            >
                               {isAuthenticating ? <Icon name="loader" className="w-4 h-4 animate-spin"/> : null}
                               <span>{isAuthenticating ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}</span>
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const docStructure = {
  'Meta': {
    'Application Walkthrough': '/server/branding/connect_accounts/meta/application_walkthrough.js',
    'OAuth Flow': '/server/branding/connect_accounts/meta/OAuth.js',
    'Test Scopes': {
      'Post Videos to Page': '/server/branding/connect_accounts/meta/Test_scopes/Test_scopes_for_post_videos_in_page.js',
      'Post Videos to Group': '/server/branding/connect_accounts/meta/Test_scopes/Test_scopes_for_post_videos_in_group.js',
    }
  },
  'X (Twitter)': {
    'Application Walkthrough': '/server/branding/connect_accounts/x/application_walkthrough.js',
    'OAuth Flow': '/server/branding/connect_accounts/x/OAuth.js',
    'Test Scopes': {
      'Posting a Tweet': '/server/branding/connect_accounts/x/Test_scopes/Test_scopes_for_posting_tweet.js',
    }
  },
  'LinkedIn': {
    'Application Walkthrough': '/server/branding/connect_accounts/linkedin/application_walkthrough.js',
    'OAuth Flow': '/server/branding/connect_accounts/linkedin/OAuth.js',
    'Test Scopes': {
      'Posting to Profile': '/server/branding/connect_accounts/linkedin/Test_scopes/Test_scopes_for_posting_to_profile.js',
    }
  },
  'TikTok': {
    'Application Walkthrough': '/server/branding/connect_accounts/tiktok/application_walkthrough.js',
    'OAuth Flow': '/server/branding/connect_accounts/tiktok/OAuth.js',
    'Test Scopes': {
      'Fetching User Info': '/server/branding/connect_accounts/tiktok/Test_scopes/Test_scopes_for_user_info.js',
    }
  },
};

const DocumentationViewer: React.FC<{ docPath: string }> = ({ docPath }) => {
    const [content, setContent] = useState<string>('Loading...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setContent('Loading...');
        setError(null);

        const loadContent = async () => {
            try {
                const module = await import(/* @vite-ignore */ docPath);
                if (isMounted) {
                    setContent(module.content);
                }
            } catch (e) {
                console.error(`Failed to load doc: ${docPath}`, e);
                if (isMounted) {
                    setError('Could not load documentation file. Make sure it exists and is a valid module.');
                }
            }
        };

        loadContent();

        return () => {
            isMounted = false;
        };
    }, [docPath]);

    return (
        <div className="p-4 bg-gray-950/50 rounded-lg border border-gray-700/50 h-full max-h-[40rem] overflow-y-auto font-mono text-sm text-gray-300">
            {error ? <p className="text-red-400">{error}</p> : <pre className="whitespace-pre-wrap">{content}</pre>}
        </div>
    );
};

const DocTree: React.FC<{
    data: any;
    onSelect: (path: string) => void;
    activeDoc: string | null;
    level?: number;
}> = ({ data, onSelect, activeDoc, level = 0 }) => {
    return (
        <ul className={level > 0 ? 'pl-4' : ''}>
            {Object.entries(data).map(([key, value]) => (
                <li key={key} className="my-1">
                    {typeof value === 'string' ? (
                        <button
                            onClick={() => onSelect(value as string)}
                            className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                                activeDoc === value
                                    ? 'bg-brand-500/20 text-brand-300 font-semibold'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            }`}
                        >
                            {key}
                        </button>
                    ) : (
                        <div>
                            <span className={`font-semibold text-gray-200 text-sm ${level > 0 ? 'pt-2 block' : ''}`}>{key}</span>
                            <DocTree data={value} onSelect={onSelect} activeDoc={activeDoc} level={level + 1} />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};


const BrandingContent: React.FC = () => {
    const socialAccounts = [
        { name: 'Meta', route: 'facebook', icon: 'meta', description: 'Facebook & Instagram', color: 'text-blue-500' },
        { name: 'X (Twitter)', route: 'twitter', icon: 'x', description: 'Post real-time updates.', color: 'text-gray-400' },
        { name: 'LinkedIn', route: 'linkedin', icon: 'linkedin', description: 'For professional content.', color: 'text-sky-600' },
        { name: 'TikTok', route: 'tiktok', icon: 'tiktok', description: 'Create engaging short videos.', color: 'text-teal-400' },
    ];
    
    const brandColors = [
        { name: 'Primary', hex: '#0ea5e9' },
        { name: 'Secondary', hex: '#38bdf8' },
        { name: 'Accent', hex: '#7dd3fc' },
        { name: 'Neutral', hex: '#e5e7eb' },
    ];

    const brandFonts = [
        { name: 'Heading', family: 'Inter' },
        { name: 'Body', family: 'Roboto' },
    ];

    const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'disconnected' | 'authenticating' | 'connected'}>({});
    const [activeDoc, setActiveDoc] = useState<string | null>(null);

    const handleConnect = (accountRoute: string) => {
        const authUrl = `http://localhost:3001/auth/${accountRoute}`;
        const width = 600, height = 700;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        window.open(
            authUrl,
            'AuthPopup',
            `width=${width},height=${height},top=${top},left=${left}`
        );
    };

    const handleDisconnect = useCallback((accountName: string) => {
        setConnectionStatus(prev => ({ ...prev, [accountName]: 'disconnected' }));
    }, []);

    const handleAuthSuccess = useCallback((platform: string) => {
        const account = socialAccounts.find(acc => acc.route === platform);
        if (account) {
            setConnectionStatus(prev => ({...prev, [account.name]: 'connected' }));
        }
    }, [socialAccounts]);

    const handleAuthCancel = useCallback((platform: string) => {
        const account = socialAccounts.find(acc => acc.route === platform);
        if (account) {
            setConnectionStatus(prev => ({...prev, [account.name]: 'disconnected' }));
        }
    }, [socialAccounts]);

    useEffect(() => {
        const handleAuthMessage = (event: MessageEvent) => {
            // IMPORTANT: In a production app, you should verify the origin of the message
            // if (event.origin !== 'http://localhost:3001') return;

            const { type, platform } = event.data;
            if (type === 'auth-success') {
                handleAuthSuccess(platform);
            } else if (type === 'auth-failure') {
                handleAuthCancel(platform);
            }
        };

        window.addEventListener('message', handleAuthMessage);

        return () => {
            window.removeEventListener('message', handleAuthMessage);
        };
    }, [handleAuthSuccess, handleAuthCancel]);


    return (
        <div className="p-4 space-y-8">
            {/* Brand Assets Section */}
            <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Brand Assets</h3>
                <div className="space-y-4">
                    {/* Logos */}
                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <h4 className="text-md font-semibold text-gray-200 mb-2">Logos</h4>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            <div className="aspect-square bg-gray-700 rounded-md flex items-center justify-center"><Icon name="image" className="w-8 h-8 text-gray-500" /></div>
                            <div className="aspect-square bg-gray-700 rounded-md flex items-center justify-center"><Icon name="image" className="w-8 h-8 text-gray-500" /></div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-md py-2 transition-colors">
                            <Icon name="upload" className="w-4 h-4" /> Upload Logo
                        </button>
                    </div>

                    {/* Colors */}
                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                         <h4 className="text-md font-semibold text-gray-200 mb-2">Colors</h4>
                         <div className="space-y-2 mb-3">
                             {brandColors.map(color => (
                                 <div key={color.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-600" style={{backgroundColor: color.hex}}></div>
                                        <span>{color.name}</span>
                                    </div>
                                    <span className="font-mono text-xs text-gray-400">{color.hex}</span>
                                 </div>
                             ))}
                         </div>
                         <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-md py-2 transition-colors">
                            <Icon name="plus" className="w-4 h-4" /> Add Color
                        </button>
                    </div>
                     {/* Fonts */}
                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                         <h4 className="text-md font-semibold text-gray-200 mb-2">Fonts</h4>
                         <div className="space-y-2 mb-3">
                             {brandFonts.map(font => (
                                 <div key={font.name} className="flex items-center justify-between text-sm">
                                    <span>{font.name}</span>
                                    <span className="text-gray-400">{font.family}</span>
                                 </div>
                             ))}
                         </div>
                         <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-md py-2 transition-colors">
                            <Icon name="plus" className="w-4 h-4" /> Add Font
                        </button>
                    </div>
                </div>
            </div>

            {/* Connected Accounts Section */}
            <div>
                 <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Connected Accounts</h3>
                 <div className="space-y-3">
                    {socialAccounts.map(account => {
                        const status = connectionStatus[account.name] || 'disconnected';
                        const isConnected = status === 'connected';
                        return (
                            <div key={account.name} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Icon name={account.icon} className={`w-8 h-8 ${account.color}`} />
                                    <div>
                                        <h4 className="font-semibold text-gray-100">{account.name}</h4>
                                        <p className="text-xs text-gray-400">{account.description}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-700/50">
                                    {isConnected ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <p className="text-xs text-green-400 font-semibold">Connected</p>
                                            </div>
                                            <button
                                                onClick={() => handleDisconnect(account.name)}
                                                className="text-xs font-semibold bg-red-900/60 hover:bg-red-800/70 text-red-300 rounded-md py-1 px-3 transition-colors"
                                            >
                                                Disconnect
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleConnect(account.route)}
                                            className="w-full flex items-center justify-center gap-2 text-xs font-semibold rounded-md py-1.5 px-4 transition-colors disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400"
                                        >
                                            <span>{'Connect'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                 </div>
            </div>
            {/* Developer Documentation Section */}
            <div>
                 <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Developer Documentation</h3>
                 <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-1">
                           <h4 className="text-md font-semibold text-gray-200 mb-2">API Guides</h4>
                           <DocTree data={docStructure} onSelect={setActiveDoc} activeDoc={activeDoc} />
                        </div>
                         <div className="col-span-2">
                            {activeDoc ? <DocumentationViewer docPath={activeDoc} /> : (
                                <div className="h-full flex items-center justify-center text-center text-gray-500 bg-gray-900/50 rounded-md p-4 border border-dashed border-gray-700">
                                    <p>Select a document to view its contents.</p>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

const PlaceholderContent: React.FC<{itemName: string}> = ({itemName}) => (
    <div className="p-4 text-center text-gray-400 h-full flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 text-gray-600">
            <Icon name="puzzle" />
        </div>
        <h3 className="text-lg font-semibold text-gray-300">{itemName}</h3>
        <p className="text-sm">This feature is currently under development.</p>
        <div className="mt-2 px-4 py-2 bg-yellow-900/50 border border-yellow-700/50 rounded-lg text-yellow-300 text-xs font-medium">
            Coming Soon!
        </div>
    </div>
);

const ContentPanel: React.FC<ContentPanelProps> = ({ activeItem, onClose, version, pushedFeatures, onTogglePushFeature }) => {
    const availableItems = version === AppVersion.DEVELOPER ? DEVELOPER_SIDEBAR_ITEMS : CLIENT_SIDEBAR_ITEMS;
    const item = availableItems.find(i => i.id === activeItem);

    const renderContent = () => {
        switch(activeItem) {
            case 'integrations':
                return <IntegrationsContent />;
            case 'branding':
                return <BrandingContent />;
            case 'push':
                return <PushContent pushedFeatures={pushedFeatures} onToggle={onTogglePushFeature} />;
            case 'server':
                return <ServerContent />;
            case 'checklist':
                return <ChecklistContent />;
            default:
                return <PlaceholderContent itemName={item?.label || 'Item'} />;
        }
    }

    if (!item) return null;

    return (
        <aside className="w-80 bg-gray-900/70 backdrop-blur-sm border-r border-gray-700/50 flex flex-col animate-slide-in flex-shrink-0">
            <header className="p-3 flex items-center justify-between border-b border-gray-700/50 h-16 flex-shrink-0">
                <h2 className="text-lg font-semibold flex items-center gap-3 text-gray-200">
                    <span className="text-brand-400 w-6 h-6">{item.icon}</span>
                    <span>{item.label}</span>
                </h2>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700/50 transition-colors" aria-label="Close panel">
                    <Icon name="x" className="w-5 h-5"/>
                </button>
            </header>
            <div className="flex-1 overflow-y-auto">
                {renderContent()}
            </div>
        </aside>
    );
};

export default ContentPanel;