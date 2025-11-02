
import React, { useState, useCallback } from 'react';
import { Icon } from './common/Icon';
import CalendarView from './CalendarView';
import SchedulePostModal from './SchedulePostModal';
import { PlatformName } from './BrandingContent';
import { getPostIdeas } from '../services/geminiService';

export interface ScheduledPost {
  id: string;
  platforms: PlatformName[];
  content: string;
  imageUrl?: string;
  scheduledAt: Date;
  status: 'scheduled' | 'posted' | 'failed';
}

const initialPosts: ScheduledPost[] = [
    {
      id: 'post-1',
      platforms: ['Meta', 'Instagram'],
      content: 'Check out our new summer collection!',
      scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)),
      status: 'scheduled'
    },
    {
      id: 'post-2',
      platforms: ['X'],
      content: 'A quick update on our opening hours.',
      scheduledAt: new Date(new Date().setDate(new Date().getDate() + 5)),
      status: 'scheduled'
    },
];

const ContentPlanner: React.FC = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [ideas, setIdeas] = useState<string[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideasError, setIdeasError] = useState<string | null>(null);

  const handleFetchIdeas = useCallback(async () => {
      setIdeasLoading(true);
      setIdeasError(null);
      try {
          // In a real app, brand and platform would be dynamic from the app's context
          const fetchedIdeas = await getPostIdeas("MV", "Meta");
          setIdeas(fetchedIdeas);
      } catch (e) {
          if (e instanceof Error) {
              setIdeasError(e.message);
          } else {
              setIdeasError("An unknown error occurred.");
          }
      } finally {
          setIdeasLoading(false);
      }
  }, []);


  const handleOpenModal = (post?: ScheduledPost) => {
    setSelectedPost(post || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleSavePost = (post: ScheduledPost) => {
    setPosts(prevPosts => {
      const existing = prevPosts.find(p => p.id === post.id);
      if (existing) {
        return prevPosts.map(p => p.id === post.id ? post : p);
      }
      return [...prevPosts, post];
    });
    handleCloseModal();
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold">Content Planner</h2>
        <div className="flex items-center gap-2">
            <button 
                onClick={handleFetchIdeas}
                disabled={ideasLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors disabled:opacity-50"
            >
                <Icon name="wand" className="w-4 h-4" />
                <span>Get Post Ideas</span>
            </button>
            <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-md transition-colors">
                <Icon name="plus" className="w-4 h-4" />
                <span>Schedule Post</span>
            </button>
        </div>
      </div>

      {ideasError && <p className="text-sm text-red-400 mb-4">{ideasError}</p>}
      {ideasLoading && <p className="text-sm text-blue-400 mb-4">Generating ideas with AI...</p>}
      {ideas.length > 0 && (
          <div className="mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700 flex-shrink-0">
              <h3 className="text-sm font-semibold mb-2">AI Generated Ideas:</h3>
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                  {ideas.map((idea, index) => <li key={index}>{idea}</li>)}
              </ul>
          </div>
      )}

      <div className="flex justify-center mb-4 flex-shrink-0">
          <div className="flex items-center p-1 bg-gray-900 rounded-full border border-gray-700">
              <button onClick={() => setView('calendar')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-300 ${view === 'calendar' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                  Calendar
              </button>
              <button onClick={() => setView('list')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-300 ${view === 'list' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                  List
              </button>
          </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
          {view === 'calendar' ? (
              <CalendarView
                  posts={posts}
                  onSelectPost={handleOpenModal}
                  currentDate={currentDate}
                  onNavigate={setCurrentDate}
              />
          ) : (
             <div className="text-gray-400 p-4">List view is not implemented yet.</div>
          )}
      </div>

      {isModalOpen && (
        <SchedulePostModal
          post={selectedPost}
          onClose={handleCloseModal}
          onSave={handleSavePost}
        />
      )}
    </div>
  );
};

export default ContentPlanner;
