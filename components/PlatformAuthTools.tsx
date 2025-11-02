import React, { useState, useEffect } from 'react';
import { Icon } from './common/Icon';
import { PlatformName } from './BrandingContent';

const PLATFORMS: PlatformName[] = ['Meta', 'X', 'LinkedIn', 'TikTok', 'Instagram', 'Pinterest'];

const PlatformAuthTools: React.FC = () => {
    const [connectionStatus, setConnectionStatus] = useState<Record<string, { connected: boolean; username?: string }>>({});

    useEffect(() => {
        // In a real app, this would check tokens from localStorage and maybe validate them
        const newStatus: Record<string, { connected: boolean; username?: string }> = {};
        PLATFORMS.forEach(platform => {
            const platformKey = platform.toLowerCase() === 'meta' || platform.toLowerCase() === 'instagram' ? 'meta' : platform.toLowerCase();
            const token = localStorage.getItem(`${platformKey}_jwt`);
            newStatus[platform] = {
                connected: !!token,
                username: token ? 'User Connected' : undefined
            };
        });
        setConnectionStatus(newStatus);
    }, []);
    
    const handleConnect = (platform: PlatformName) => {
        // This is a simplified connect logic, actual implementation is in BrandingContent
        const platformMap: Record<string, string> = {
            Meta: 'facebook',
            Instagram: 'facebook', 
            X: 'twitter',
            LinkedIn: 'linkedin',
            TikTok: 'tiktok',
            Pinterest: 'pinterest'
        };
        const authProvider = platformMap[platform];
        if (!authProvider) {
            alert(`Authentication provider for ${platform} is not configured.`);
            return;
        }
        // Assuming local auth server is running on port 3001 as per server/auth.js
        const authUrl = `http://localhost:3001/auth/${authProvider}`;
        window.open(authUrl, '_blank', 'width=600,height=700');

        // Listen for message from popup - simplified for this component
        const handleAuthMessage = (event: MessageEvent) => {
             if (event.data.type === 'auth-success' && event.data.platform.toLowerCase() === platformKey) {
                setConnectionStatus(prev => ({
                    ...prev,
                    [platform]: { connected: true, username: 'User Connected'}
                }))
             }
             window.removeEventListener('message', handleAuthMessage);
        }
        const platformKey = platform.toLowerCase() === 'meta' || platform.toLowerCase() === 'instagram' ? 'meta' : platform.toLowerCase();
        window.addEventListener('message', handleAuthMessage);
    };

    const handleDisconnect = (platform: PlatformName) => {
        const platformKey = platform.toLowerCase() === 'meta' || platform.toLowerCase() === 'instagram' ? 'meta' : platform.toLowerCase();
        localStorage.removeItem(`${platformKey}_jwt`);
        setConnectionStatus(prev => ({
            ...prev,
            [platform]: { connected: false }
        }))
    }

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-md font-semibold text-gray-200">Platform Connections</h3>
            <div className="space-y-2">
                {PLATFORMS.map(platform => {
                    const status = connectionStatus[platform] || { connected: false };
                    return (
                        <div key={platform} className="p-3 bg-gray-800 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${status.connected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                <span className="font-semibold">{platform}</span>
                            </div>
                            {status.connected ? (
                                <button onClick={() => handleDisconnect(platform)} className="px-3 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors">
                                    Disconnect
                                </button>
                            ) : (
                                <button onClick={() => handleConnect(platform)} className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors">
                                    Connect
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>
            <div className="text-xs text-gray-500 p-2 border-t border-gray-700/50 mt-4">
                <p>Connection status is based on locally stored tokens. For full configuration, including App IDs and secrets, use the 'Branding' panel.</p>
            </div>
        </div>
    );
};

export default PlatformAuthTools;
