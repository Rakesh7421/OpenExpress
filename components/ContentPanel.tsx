import React, { useState } from 'react';
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

const ServerContent: React.FC = () => {
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [visibleTooltip, setVisibleTooltip] = useState<number | null>(null);
    const [jwtSecret, setJwtSecret] = useState<string>('your-super-secret-jwt-key');
    const [isJwtSecretVisible, setIsJwtSecretVisible] = useState<boolean>(false);


    const handleDownloadRepo = () => {
        const fileContent = `
############################################################
# OpenExpress Development Server Setup
############################################################

This file contains the code and instructions to set up your local
development server. Create the files as described below in a new directory.

------------------------------------------------------------
1. Create a file named 'package.json'
------------------------------------------------------------

Copy and paste the following content. This includes 'cors' to allow
requests from your frontend application.

\`\`\`json
{
  "name": "openexpress-server",
  "version": "1.0.0",
  "description": "Backend server for OpenExpress.",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  }
}
\`\`\`

------------------------------------------------------------
2. Create a file named '.env.example'
------------------------------------------------------------

Copy this into .env.example. You will rename this to '.env' and add
your secrets for a real application.

\`\`\`
# Port for the server to run on
PORT=8080

# Your database connection string
DATABASE_URL="your_connection_string_here"

# Add your JWT Secret for token signing
JWT_SECRET="your-super-secret-jwt-key"
\`\`\`

------------------------------------------------------------
3. Create a file named 'index.js'
------------------------------------------------------------

This is the main server file. It's set up to handle JSON and CORS.
A sample '/api/save-design' endpoint is included to demonstrate
receiving data from the frontend.

\`\`\`javascript
/* 
  A functional Express.js server for the OpenExpress app.
*/
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON bodies in requests

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'OpenExpress server is running!' });
});

app.post('/api/save-design', (req, res) => {
  console.log('Received design data to save:', req.body);
  
  // Example of how you might use a JWT secret in a real app
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.startsWith('Bearer ')) {
    // return res.status(401).json({ error: 'Authorization token is required.' });
    console.log('No auth token present, proceeding for demo.');
  }

  if (!req.body || !req.body.title) {
    return res.status(400).json({ error: 'Design title is required.' });
  }
  
  // In a real app, you would save this data to a database.
  res.status(201).json({ 
    message: 'Design saved successfully!', 
    designId: \`dsn_\${Date.now()}\`,
    dataReceived: req.body 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(\`Server listening on port \${PORT}\`);
});
\`\`\`

------------------------------------------------------------
After creating these files, follow the setup guide in the app:
- Run 'npm install'
- Create '.env' from '.env.example' and configure it
- Run 'npm start' to start your server
------------------------------------------------------------
`;
        const blob = new Blob([fileContent.trimStart()], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'server-setup-guide.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    const RepoStepDetails: React.FC = () => (
        <div>
            <p className="font-semibold mb-1 text-gray-200">Option A: Clone (Git)</p>
            <p className="text-gray-400 mb-3">Use 'git clone <repository_url>' in your terminal.</p>
            
            <p className="font-semibold mb-1 text-gray-200">Option B: Download</p>
            <p className="text-gray-400 mb-2">Get a text file with setup instructions and all necessary code.</p>
            <button
                onClick={handleDownloadRepo}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-md py-1.5 transition-colors"
            >
                <Icon name="download" className="w-4 h-4" />
                Download server-setup-guide.txt
            </button>
        </div>
    );

    const setupSteps = [
        { id: 1, text: "Clone or Download server code", details: <RepoStepDetails /> },
        { id: 2, text: "Install dependencies", details: "Navigate into the project directory and run 'npm install' or 'yarn install' to download all required packages." },
        { id: 3, text: "Configure environment", details: "Create a '.env' file in the server's root directory. Copy the contents of '.env.example' and fill in your secrets, including the JWT_SECRET." },
        { id: 4, text: "Start the server", details: "Run 'npm start' or 'yarn start' in the server's directory to launch the backend on a local port." },
        { id: 5, text: "Click 'Connect' above", details: "Once the server is running, use the button in the 'Backend Server' panel above to establish a connection for the UI." },
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
        if (status === 'connected') {
            setStatus('disconnected');
        } else if (status === 'disconnected') {
            setStatus('connecting');
            setTimeout(() => {
                setStatus('connected');
            }, 1500);
        }
    };
    
    const isConnected = status === 'connected';
    const isConnecting = status === 'connecting';

    return (
        <div className="p-4 space-y-6">
             <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h3 className="text-md font-semibold text-gray-200 mb-3">Backend Server</h3>
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
                 <p className="text-xs text-gray-500 mt-3 text-center">Connect to your local development server.</p>
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
        !CLIENT_SIDEBAR_ITEMS.some(clientItem => clientItem.id === item.id) && !['push', 'server'].includes(item.id)
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
    
    const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'disconnected' | 'connecting' | 'connected'}>({});

    const handleConnect = (name: string) => {
        setConnectionStatus(prev => ({ ...prev, [name]: 'connecting' }));
        setTimeout(() => {
            setConnectionStatus(prev => ({ ...prev, [name]: 'connected' }));
        }, 1500);
    };

    const handleDisconnect = (name: string) => {
        setConnectionStatus(prev => ({ ...prev, [name]: 'disconnected' }));
    };

    return (
        <div className="p-4 space-y-4">
            <input type="search" placeholder="Search integrations..." className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition" />
            <div className="grid grid-cols-2 gap-2">
                {integrations.map(int => {
                    const status = connectionStatus[int.name] || 'disconnected';
                    const isConnecting = status === 'connecting';
                    const isConnected = status === 'connected';
                    return (
                        <div key={int.name} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 space-y-2 flex flex-col items-center text-center hover:bg-gray-800 transition-colors">
                            <Icon name={int.icon} className="w-10 h-10 text-gray-300 mb-2" />
                            <h4 className="text-sm font-semibold text-gray-100">{int.name}</h4>
                            <p className="text-xs text-gray-400 flex-grow">{int.description}</p>
                            <button 
                                onClick={() => isConnected ? handleDisconnect(int.name) : handleConnect(int.name)}
                                disabled={isConnecting}
                                className={`w-full mt-2 text-xs font-semibold rounded-md py-1.5 transition-colors flex items-center justify-center gap-1 disabled:cursor-not-allowed ${
                                    isConnected
                                    ? 'bg-green-900/60 hover:bg-green-800/70 text-green-300'
                                    : 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-600'
                                }`}
                            >
                               {isConnecting ? <Icon name="loader" className="w-4 h-4 animate-spin"/> : null}
                               <span>{isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}</span>
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const BrandingContent: React.FC = () => {
    const socialAccounts = [
        { name: 'Meta', icon: 'meta', description: 'Facebook & Instagram', color: 'text-blue-500' },
        { name: 'X (Twitter)', icon: 'x', description: 'Post real-time updates.', color: 'text-gray-400' },
        { name: 'LinkedIn', icon: 'linkedin', description: 'For professional content.', color: 'text-sky-600' },
        { name: 'TikTok', icon: 'tiktok', description: 'Create engaging short videos.', color: 'text-teal-400' },
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

    const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'disconnected' | 'connecting' | 'connected'}>({});

    const handleConnect = (accountName: string) => {
        setConnectionStatus(prev => ({ ...prev, [accountName]: 'connecting' }));
        setTimeout(() => {
            setConnectionStatus(prev => ({ ...prev, [accountName]: 'connected' }));
        }, 1500);
    };

    const handleDisconnect = (accountName: string) => {
        setConnectionStatus(prev => ({ ...prev, [accountName]: 'disconnected' }));
    };


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
                        const isConnecting = status === 'connecting';
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
                                            onClick={() => handleConnect(account.name)}
                                            disabled={isConnecting}
                                            className="w-full flex items-center justify-center gap-2 text-xs font-semibold rounded-md py-1.5 px-4 transition-colors disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400"
                                        >
                                            {isConnecting && <Icon name="loader" className="w-4 h-4 animate-spin" />}
                                            <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
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
