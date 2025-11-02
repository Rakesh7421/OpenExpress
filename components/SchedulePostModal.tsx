
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ScheduledPost } from './ContentPlanner';
import { Icon } from './common/Icon';
import { PlatformName } from './BrandingContent';

interface SchedulePostModalProps {
  post: ScheduledPost | null;
  onClose: () => void;
  onSave: (post: ScheduledPost) => void;
}

const ALL_PLATFORMS: PlatformName[] = ['Meta', 'X', 'LinkedIn', 'TikTok', 'Instagram', 'Pinterest'];

const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ post, onClose, onSave }) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformName>>(new Set());
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  useEffect(() => {
    if (post) {
      setContent(post.content);
      setSelectedPlatforms(new Set(post.platforms));
      const d = new Date(post.scheduledAt);
      setScheduledDate(d.toISOString().split('T')[0]); // YYYY-MM-DD
      setScheduledTime(d.toTimeString().substring(0, 5)); // HH:MM
    } else {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);
        setScheduledDate(now.toISOString().split('T')[0]);
        setScheduledTime(now.toTimeString().substring(0, 5));
    }
  }, [post]);

  const handlePlatformToggle = (platform: PlatformName) => {
    setSelectedPlatforms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(platform)) {
        newSet.delete(platform);
      } else {
        newSet.add(platform);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || selectedPlatforms.size === 0 || !scheduledDate || !scheduledTime) {
      alert('Please fill out all fields.');
      return;
    }
    
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
    
    const newPost: ScheduledPost = {
      id: post?.id || uuidv4(),
      content,
      platforms: Array.from(selectedPlatforms),
      scheduledAt,
      status: 'scheduled',
    };
    onSave(newPost);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold text-white mb-4">{post ? 'Edit Post' : 'Schedule New Post'}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-400">Content</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={5}
                className="mt-1 w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500"
                placeholder="What do you want to share?"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">Platforms</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {ALL_PLATFORMS.map(platform => (
                  <button
                    type="button"
                    key={platform}
                    onClick={() => handlePlatformToggle(platform)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors border ${
                      selectedPlatforms.has(platform)
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="mt-1 w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="mt-1 w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg">
              {post ? 'Save Changes' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulePostModal;
