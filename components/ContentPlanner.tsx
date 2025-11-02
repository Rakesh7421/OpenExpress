import React, { useState, useCallback } from 'react';
import { Icon } from './common/Icon';
import { getPostIdeas } from '../services/geminiService';

interface ScheduledPost {
    id: string;
    content: string;
    platforms: string[];
    scheduledAt: Date;
    status: 'scheduled' | 'posted' | 'failed';
}

const PLATFORMS = [
    { id: 'meta', name: 'Meta', icon: 'facebook' },
    { id: 'twitter', name: 'X', icon: 'twitter' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
    { id: 'tiktok', name: 'TikTok', icon: 'tiktok' },
    { id: 'instagram', name: 'Instagram', icon: 'instagram' },
    { id: 'pinterest', name: 'Pinterest', icon: 'pinterest' },
];

const ContentPlanner: React.FC = () => {
    const [postContent, setPostContent] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
    const [scheduledDateTime, setScheduledDateTime] = useState('');
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
    
    const [ideaBrand, setIdeaBrand] = useState('a local coffee shop');
    const [ideaPlatform, setIdeaPlatform] = useState('instagram');
    const [ideas, setIdeas] = useState<string[]>([]);
    const [isIdeasLoading, setIsIdeasLoading] = useState(false);
    const [ideasError, setIdeasError] = useState<string | null>(null);

    const handlePlatformToggle = (platformId: string) => {
        setSelectedPlatforms(prev => {
            const newSet = new Set(prev);
            if (newSet.has(platformId)) {
                newSet.delete(platformId);
            } else {
                newSet.add(platformId);
            }
            return newSet;
        });
    };

    const handleSchedulePost = () => {
        if (!postContent || selectedPlatforms.size === 0 || !scheduledDateTime) {
            alert('Please fill in all fields: content, at least one platform, and a date/time.');
            return;
        }

        const newPost: ScheduledPost = {
            id: `post_${Date.now()}`,
            content: postContent,
            platforms: Array.from(selectedPlatforms),
            scheduledAt: new Date(scheduledDateTime),
            status: 'scheduled',
        };

        setScheduledPosts(prev => [newPost, ...prev]);

        // Reset form
        setPostContent('');
        setSelectedPlatforms(new Set());
        setScheduledDateTime('');
    };
    
    const handleGenerateIdeas = useCallback(async () => {
        setIsIdeasLoading(true);
        setIdeasError(null);
        setIdeas([]);
        try {
            const result = await getPostIdeas(ideaBrand, ideaPlatform);
            setIdeas(result);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'An unknown error occurred.';
            setIdeasError(message);
        } finally {
            setIsIdeasLoading(false);
        }
    }, [ideaBrand, ideaPlatform]);

    return (
        <div className="p-4 space-y-6 text-gray-300 h-full flex flex-col">
            <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-md font-semibold text-gray-200">Create & Schedule Post</h3>
                <div>
                    <label htmlFor="post-content" className="block text-sm font-medium text-gray-400 mb-1">Content</label>
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
                    <label className="block text-sm font-medium text-gray-400 mb-2">Platforms</label>
                    <div className="grid grid-cols-3 gap-2">
                        {PLATFORMS.map(platform => (
                            <button
                                key={platform.id}
                                onClick={() => handlePlatformToggle(platform.id)}
                                className={`flex items-center justify-center gap-2 p-2 rounded-md transition-colors text-xs ${selectedPlatforms.has(platform.id) ? 'bg-brand-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                <Icon name={platform.icon} className="w-4 h-4" />
                                <span>{platform.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-400 mb-1">Schedule Date & Time</label>
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
                             <label htmlFor="idea-platform" className="block text-xs font-medium text-gray-400 mb-1">Platform</label>
                             <select id="idea-platform" value={ideaPlatform} onChange={e => setIdeaPlatform(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm">
                                 {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                             </select>
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

            <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-md font-semibold text-gray-200 mb-2">Scheduled Posts</h3>
                <div className="flex-1 overflow-y-auto space-y-2 bg-gray-800/50 p-2 rounded-lg border border-gray-700">
                    {scheduledPosts.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No posts scheduled yet.</p>
                    )}
                    {scheduledPosts.map(post => (
                        <div key={post.id} className="p-3 bg-gray-800 rounded-md">
                            <p className="text-sm line-clamp-2">{post.content}</p>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                                <span>{post.scheduledAt.toLocaleString()}</span>
                                <div className="flex items-center gap-2">
                                    {post.platforms.map(pId => {
                                        const platform = PLATFORMS.find(p => p.id === pId);
                                        return platform ? <Icon key={pId} name={platform.icon} className="w-4 h-4" title={platform.name} /> : null;
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContentPlanner;
