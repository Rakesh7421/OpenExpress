import React, { useState, useCallback, useEffect } from 'react';
import { Icon } from './common/Icon';
import { getPostIdeas } from '../services/geminiService';
import { initialAppConfig } from '../config/appConfig'; // Assuming this is exported

interface ScheduledPost {
    id: string;
    content: string;
    accounts: { id: string; name: string; platform: string }[];
    scheduledAt: Date;
    status: 'scheduled' | 'posted' | 'failed';
}

interface Account {
    id: string; // e.g., pageId for Facebook
    name: string;
    platform: 'Meta' | 'Instagram';
    brand: string;
    connected: boolean; // New status indicator
}

const ContentPlanner: React.FC = () => {
    const [postContent, setPostContent] = useState('');
    const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
    const [scheduledDateTime, setScheduledDateTime] = useState('');
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [ideaBrand, setIdeaBrand] = useState('a local coffee shop');
    const [ideas, setIdeas] = useState<string[]>([]);
    const [isIdeasLoading, setIsIdeasLoading] = useState(false);
    const [ideasError, setIdeasError] = useState<string | null>(null);
    
    const [groupedAccounts, setGroupedAccounts] = useState<Record<string, Account[]>>({});
    const [isAccountsLoading, setIsAccountsLoading] = useState(true);

     useEffect(() => {
        const fetchAccounts = async () => {
            setIsAccountsLoading(true);
            const allGroupedAccounts: Record<string, Account[]> = {};
            const appConfig = initialAppConfig; // In a real app, this might come from props or context

            for (const user of Object.values(appConfig.users)) {
                for (const [brandName, brandConfig] of Object.entries(user.brands)) {
                    // Check for a valid Meta user token for this brand (dev or live)
                    const userToken = brandConfig.platforms?.Meta?.dev?.tokens?.user || brandConfig.platforms?.Meta?.live?.tokens?.user;
                    const isConnected = !!userToken;

                    if (isConnected) {
                        try {
                            const url = `https://graph.facebook.com/me/accounts?fields=name,id,instagram_business_account{name,username}&access_token=${userToken}`;
                            const response = await fetch(url);
                            const data = await response.json();

                            if (data.data) {
                                const brandAccounts: Account[] = [];
                                data.data.forEach((page: any) => {
                                    // Add Facebook Page
                                    brandAccounts.push({ id: page.id, name: page.name, platform: 'Meta', brand: brandName, connected: isConnected });
                                    
                                    // Add linked Instagram Account if it exists
                                    if (page.instagram_business_account) {
                                        brandAccounts.push({ 
                                            id: page.instagram_business_account.id, 
                                            name: page.instagram_business_account.name || page.instagram_business_account.username,
                                            platform: 'Instagram',
                                            brand: brandName,
                                            connected: isConnected
                                        });
                                    }
                                });
                                if (brandAccounts.length > 0) {
                                     allGroupedAccounts[brandName] = brandAccounts;
                                }
                            }
                        } catch (error) {
                            console.error(`Failed to fetch accounts for brand ${brandName}:`, error);
                        }
                    } else {
                        // If not connected, we can still show a placeholder if needed, or just skip.
                        // For now, we'll just show connected brands.
                    }
                }
            }
            setGroupedAccounts(allGroupedAccounts);
            setIsAccountsLoading(false);
        };

        fetchAccounts();
    }, []);


    const handleAccountToggle = (accountId: string) => {
        setSelectedAccounts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(accountId)) {
                newSet.delete(accountId);
            } else {
                newSet.add(accountId);
            }
            return newSet;
        });
    };

    const handleSchedulePost = async () => {
        if (!postContent || selectedAccounts.size === 0 || !scheduledDateTime) {
            setStatusMessage({ type: 'error', message: 'Content, at least one account, and a date/time are required.' });
            return;
        }

        const allAccounts = Object.values(groupedAccounts).flat();
        const accountsToPost = allAccounts.filter(acc => selectedAccounts.has(acc.id));

        const promises = accountsToPost.map(account => {
            // In a real app, you would get the correct token for this account's brand
            const token = localStorage.getItem('meta_jwt'); // Using a placeholder for now
            return fetch('/api/schedule-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    accountId: account.id,
                    platform: account.platform,
                    content: postContent,
                    scheduledAt: new Date(scheduledDateTime).toISOString(),
                }),
            }).then(res => res.json().then(data => ({ ok: res.ok, data, accountName: account.name })));
        });

        const results = await Promise.all(promises);
        const successes = results.filter(r => r.ok);
        const failures = results.filter(r => !r.ok);

        if (failures.length > 0) {
            const failedNames = failures.map(f => f.accountName).join(', ');
            setStatusMessage({ type: 'error', message: `Failed to schedule for: ${failedNames}.` });
        } else {
            setStatusMessage({ type: 'success', message: `Successfully scheduled post for ${successes.length} account(s)!` });
            // Reset form on full success
            setPostContent('');
            setSelectedAccounts(new Set());
            setScheduledDateTime('');
        }
    };
    
    const handleGenerateIdeas = useCallback(async () => {
        setIsIdeasLoading(true);
        setIdeasError(null);
        setIdeas([]);
        const firstSelectedAccount = Object.values(groupedAccounts).flat().find(acc => selectedAccounts.has(acc.id));
        const platformForIdeas = firstSelectedAccount?.platform.toLowerCase() || 'instagram';

        try {
            const result = await getPostIdeas(ideaBrand, platformForIdeas);
            setIdeas(result);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'An unknown error occurred.';
            setIdeasError(message);
        } finally {
            setIsIdeasLoading(false);
        }
    }, [ideaBrand, selectedAccounts, groupedAccounts]);

    return (
        <div className="p-4 space-y-6 text-gray-300 h-full flex flex-col">
            <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-md font-semibold text-gray-200">Create & Schedule Post</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">1. Select Accounts to Post To</label>
                    <div className="p-2 bg-gray-900/50 rounded-md max-h-40 overflow-y-auto space-y-2">
                        {isAccountsLoading ? (
                            <div className="flex items-center justify-center p-4 text-xs text-gray-400">
                                <Icon name="loader" className="w-4 h-4 animate-spin mr-2"/> Loading connected accounts...
                            </div>
                        ) : Object.keys(groupedAccounts).length > 0 ? (
                            Object.entries(groupedAccounts).map(([brandName, accounts]) => (
                                <div key={brandName}>
                                    <p className="text-xs font-bold text-gray-400 px-1">{brandName}</p>
                                    {accounts.map(account => (
                                        <div key={account.id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-700/50">
                                            <input
                                                type="checkbox"
                                                id={account.id}
                                                checked={selectedAccounts.has(account.id)}
                                                onChange={() => handleAccountToggle(account.id)}
                                                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-brand-600 focus:ring-brand-500"
                                            />
                                            <div className="flex items-center gap-2 flex-1">
                                                <span 
                                                    className={`w-2 h-2 rounded-full ${account.connected ? 'bg-green-500' : 'bg-gray-600'}`}
                                                    title={account.connected ? 'Connected' : 'Not Connected'}
                                                ></span>
                                                <label htmlFor={account.id} className="text-sm flex-1 cursor-pointer">{account.name} <span className="text-xs text-gray-500">({account.platform})</span></label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                             <p className="text-xs text-center text-gray-500 p-4">No connected accounts found. Please connect a Meta account in the 'Branding' panel.</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="post-content" className="block text-sm font-medium text-gray-400 mb-1">2. Compose Content</label>
                    <textarea
                        id="post-content"
                        rows={5}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                        placeholder="What's on your mind?"
                    />
                </div>
                
                <div>
                    <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-400 mb-1">3. Schedule Date & Time</label>
                    <input
                        id="schedule-time"
                        type="datetime-local"
                        value={scheduledDateTime}
                        onChange={e => setScheduledDateTime(e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                </div>
                <button
                    onClick={handleSchedulePost}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors"
                >
                    <Icon name="calendar" className="w-4 h-4" />
                    <span>Schedule Post</span>
                </button>
                 {statusMessage && (
                    <div className={`p-2 text-xs rounded-md text-center ${statusMessage.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                        {statusMessage.message}
                    </div>
                )}
            </div>

            <details className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <summary className="text-md font-semibold text-gray-200 cursor-pointer">Get Post Ideas (AI)</summary>
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label htmlFor="idea-brand" className="block text-xs font-medium text-gray-400 mb-1">Brand/Topic</label>
                            <input id="idea-brand" value={ideaBrand} onChange={e => setIdeaBrand(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm" />
                         </div>
                         <div>
                             <label htmlFor="idea-platform" className="block text-xs font-medium text-gray-400 mb-1">Platform Context</label>
                             <div className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md text-sm text-gray-400">
                                {Object.values(groupedAccounts).flat().find(acc => selectedAccounts.has(acc.id))?.platform || 'Instagram (Default)'}
                             </div>
                         </div>
                    </div>
                     <button onClick={handleGenerateIdeas} disabled={isIdeasLoading} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50">
                        {isIdeasLoading ? <Icon name="loader" className="w-4 h-4 animate-spin"/> : <Icon name="sparkles" className="w-4 h-4"/>}
                        <span>{isIdeasLoading ? 'Generating...' : 'Generate Ideas'}</span>
                    </button>
                    {ideasError && <p className="text-xs text-red-400">{ideasError}</p>}
                    {ideas.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {ideas.map((idea, index) => (
                                <div key={index} className="p-2 bg-gray-800 rounded-md flex items-start justify-between text-sm">
                                    <p className="pr-2">{idea}</p>
                                    <button onClick={() => setPostContent(idea)} className="text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-md py-1 px-2 transition-colors flex-shrink-0 ml-2">Use</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </details>
        </div>
    );
};

export default ContentPlanner;
