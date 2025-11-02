import React, { useState, useCallback, useEffect } from 'react';
import { Icon } from './common/Icon';
import { initialAppConfig } from '../config/appConfig';
import CalendarView from './CalendarView';
import SchedulePostModal from './SchedulePostModal';

export interface ScheduledPost {
    id: string;
    content: string;
    accounts: { id: string; name: string; platform: string; brand: string }[];
    scheduledAt: Date;
    status: 'scheduled' | 'posted' | 'failed';
}

export interface Account {
    id: string; // e.g., pageId for Facebook
    name: string;
    platform: 'Meta' | 'Instagram';
    brand: string;
    connected: boolean;
}

const ContentPlanner: React.FC = () => {
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [groupedAccounts, setGroupedAccounts] = useState<Record<string, Account[]>>({});
    const [isAccountsLoading, setIsAccountsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

     useEffect(() => {
        const fetchAccounts = async () => {
            setIsAccountsLoading(true);
            const allGroupedAccounts: Record<string, Account[]> = {};
            const appConfig = initialAppConfig;

            for (const user of Object.values(appConfig.users)) {
                for (const [brandName, brandConfig] of Object.entries(user.brands)) {
                    const userToken = brandConfig.platforms?.Meta?.dev?.tokens?.user || brandConfig.platforms?.Meta?.live?.tokens?.user;
                    const isConnected = !!userToken;
                    
                    if (brandConfig.platforms.Meta || brandConfig.platforms.Instagram) {
                         const brandAccounts: Account[] = [];
                        // Placeholder for fetching pages. In a real app, this would be an API call.
                        // Let's create some mock data based on connection status.
                        if (isConnected) {
                            brandAccounts.push({ id: `${brandName}-fb1`, name: `${brandName} FB Page`, platform: 'Meta', brand: brandName, connected: true });
                             if (brandConfig.platforms.Instagram) {
                                brandAccounts.push({ id: `${brandName}-ig1`, name: `${brandName} IG Profile`, platform: 'Instagram', brand: brandName, connected: true });
                            }
                        } else {
                            brandAccounts.push({ id: `${brandName}-fb1`, name: `${brandName} FB Page`, platform: 'Meta', brand: brandName, connected: false });
                        }
                         allGroupedAccounts[brandName] = brandAccounts;
                    }
                }
            }
            setGroupedAccounts(allGroupedAccounts);
            setIsAccountsLoading(false);
        };

        fetchAccounts();
    }, []);

    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleSchedulePost = async (
        selectedAccounts: Set<string>,
        baseContent: string,
        contentOverrides: Record<string, string>,
        dateTime: string
    ) => {
        if (!baseContent || selectedAccounts.size === 0 || !dateTime) {
            setStatusMessage({ type: 'error', message: 'Content, at least one account, and a date/time are required.' });
            return false;
        }

        const allAccounts = Object.values(groupedAccounts).flat();
        const accountsToPost = allAccounts.filter(acc => selectedAccounts.has(acc.id));

        const promises = accountsToPost.map(account => {
            const content = contentOverrides[account.id] || baseContent;
            const token = localStorage.getItem('meta_jwt');
            return fetch('/api/schedule-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    accountId: account.id,
                    platform: account.platform,
                    content: content,
                    scheduledAt: new Date(dateTime).toISOString(),
                }),
            }).then(res => res.json().then(data => ({ ok: res.ok, data, accountName: account.name })));
        });

        const results = await Promise.all(promises);
        const successes = results.filter(r => r.ok);
        const failures = results.filter(r => !r.ok);

        if (failures.length > 0) {
            const failedNames = failures.map(f => f.accountName).join(', ');
            setStatusMessage({ type: 'error', message: `Failed to schedule for: ${failedNames}.` });
             return false;
        } else {
            setStatusMessage({ type: 'success', message: `Successfully scheduled post for ${successes.length} account(s)!` });
            // Add to calendar view
            const newPost: ScheduledPost = {
                id: `post-${Date.now()}`,
                content: baseContent,
                accounts: accountsToPost,
                scheduledAt: new Date(dateTime),
                status: 'scheduled'
            };
            setScheduledPosts(prev => [...prev, newPost]);
            return true; // Indicate success to close modal
        }
    };
    
    return (
        <div className="p-4 text-gray-300 h-full flex flex-col">
            <h3 className="text-md font-semibold text-gray-200 mb-4">Content Planner</h3>
            {statusMessage && (
                <div className={`mb-4 p-2 text-xs rounded-md text-center ${statusMessage.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {statusMessage.message}
                </div>
            )}
            <CalendarView posts={scheduledPosts} onSelectDate={handleSelectDate} />
            
            {isModalOpen && selectedDate && (
                <SchedulePostModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    selectedDate={selectedDate}
                    groupedAccounts={groupedAccounts}
                    isAccountsLoading={isAccountsLoading}
                    onSchedule={handleSchedulePost}
                />
            )}
        </div>
    );
};

export default ContentPlanner;