
import React, { useState, useMemo } from 'react';
import CalendarView from './CalendarView';
import SchedulePostModal from './SchedulePostModal';
import { Icon } from '../common/Icon';
import { Post } from '../../types';
import { AppConfig } from '../../config/appConfig';

const mockPosts: Post[] = [
    { id: '1', platform: 'Meta', accountId: 'meta-openexpress', accountName: 'Meta Account', content: 'Our new coffee blend is here!', scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)), status: 'scheduled' },
    { id: '2', platform: 'X', accountId: 'x-openexpress', accountName: 'X Account', content: 'Come visit us this weekend!', scheduledAt: new Date(new Date().setDate(new Date().getDate() + 3)), status: 'scheduled' },
    { id: '3', platform: 'Instagram', accountId: 'instagram-openexpress', accountName: 'Instagram Account', content: 'Photo of our new latte art.', scheduledAt: new Date(new Date().setDate(new Date().getDate() - 1)), status: 'posted', mediaUrl: 'https://images.unsplash.com/photo-1511920183276-5942b2b2b2ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
];

interface ContentPlannerProps {
    appConfig: AppConfig;
    setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const ContentPlanner: React.FC<ContentPlannerProps> = ({ appConfig, setAppConfig }) => {
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Context for the planner
    const [selectedUser, setSelectedUser] = useState(appConfig.current_selection.user);
    const [selectedBrand, setSelectedBrand] = useState(appConfig.current_selection.brand);

    const selectedBrandConfig = useMemo(() => {
        return appConfig.users[selectedUser]?.brands[selectedBrand];
    }, [appConfig, selectedUser, selectedBrand]);

    const handleSchedulePosts = (newPosts: (Omit<Post, 'id' | 'status'>)[]) => {
        const postsToSchedule: Post[] = newPosts.map(p => ({
            ...p,
            id: `${p.accountId}-${new Date().toISOString()}`,
            status: 'scheduled',
        }));
        setPosts(prev => [...prev, ...postsToSchedule]);
        setIsModalOpen(false);
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                <h2 className="text-2xl font-bold text-white">Content Planner</h2>
                
                {/* Context Selectors */}
                <div className="flex items-center gap-2 p-1 bg-gray-800 rounded-lg border border-gray-700">
                     <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="p-1 bg-gray-700 border border-gray-600 rounded-md text-xs">
                        {Object.keys(appConfig.users).map(user => <option key={user} value={user}>{user}</option>)}
                    </select>
                    <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="p-1 bg-gray-700 border border-gray-600 rounded-md text-xs">
                        {Object.keys(appConfig.users[selectedUser]?.brands || {}).map(brand => <option key={brand} value={brand}>{brand || '[No Brand]'}</option>)}
                    </select>
                </div>

                <button
                    onClick={() => {
                        setSelectedDate(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors"
                >
                    <Icon name="plus" className="w-4 h-4" />
                    <span>Schedule Post</span>
                </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
                <CalendarView posts={posts} onDayClick={handleDayClick} />
            </div>

            {isModalOpen && selectedBrandConfig && (
                <SchedulePostModal
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedDate(null);
                    }}
                    onSchedule={handleSchedulePosts}
                    selectedDate={selectedDate}
                    appConfig={appConfig}
                    brandConfig={selectedBrandConfig}
                />
            )}
        </div>
    );
};

export default ContentPlanner;
