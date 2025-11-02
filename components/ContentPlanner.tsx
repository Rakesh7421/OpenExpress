
import React, { useState } from 'react';
import CalendarView from './CalendarView';
import SchedulePostModal from './SchedulePostModal';
import { Icon } from './common/Icon';
import { Post } from '../types';

// FIX: Added accountId and accountName to mock posts to match the Post type.
const mockPosts: Post[] = [
    { id: '1', platform: 'Meta', accountId: 'meta-page-1', accountName: 'Meta Page', content: 'Our new coffee blend is here!', scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)), status: 'scheduled' },
    { id: '2', platform: 'X', accountId: 'x-profile-1', accountName: 'X Profile', content: 'Come visit us this weekend!', scheduledAt: new Date(new Date().setDate(new Date().getDate() + 3)), status: 'scheduled' },
    { id: '3', platform: 'Instagram', accountId: 'insta-biz-1', accountName: 'Instagram Business', content: 'Photo of our new latte art.', scheduledAt: new Date(new Date().setDate(new Date().getDate() - 1)), status: 'posted', mediaUrl: 'https://images.unsplash.com/photo-1511920183276-5942b2b2b2ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
];

const ContentPlanner: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleSchedulePost = (post: Omit<Post, 'id' | 'status'>) => {
        const newPost: Post = {
            ...post,
            id: new Date().toISOString(),
            status: 'scheduled',
        };
        setPosts(prev => [...prev, newPost]);
        setIsModalOpen(false);
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Content Planner</h2>
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

            {isModalOpen && (
                <SchedulePostModal
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedDate(null);
                    }}
                    onSchedule={handleSchedulePost}
                    selectedDate={selectedDate}
                />
            )}
        </div>
    );
};

export default ContentPlanner;
