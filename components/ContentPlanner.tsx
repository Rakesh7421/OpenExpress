import React, { useState, useMemo } from 'react';
import { Icon } from './common/Icon';
import { getPostIdeas } from '../services/geminiService';

// Mock data
const brands = ['Nike', 'Adidas', 'Puma'];
const platforms = ['Facebook', 'Instagram', 'X', 'LinkedIn', 'TikTok'];

const StyledSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }> = ({ label, id, options, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">
      {label}
    </label>
    <select
      id={id}
      className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
      {...props}
    >
      <option value="">Select {label}...</option>
      {options.map(option => (
        <option key={option} value={option.toLowerCase().replace(' ', '_')}>{option}</option>
      ))}
    </select>
  </div>
);

const ContentPlanner: React.FC = () => {
  const [brand, setBrand] = useState('');
  const [platform, setPlatform] = useState('');
  
  const [postContent, setPostContent] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerateIdeas = async () => {
    if (!brand || !platform) return;
    setIsGenerating(true);
    setGenerationError(null);
    setIdeas([]);
    try {
      const result = await getPostIdeas(brand, platform); 
      setIdeas(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setGenerationError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSchedule = async () => {
      setIsScheduling(true);
      setScheduleStatus(null);

      // We can use any valid JWT to authenticate with the Python server,
      // as long as the secret is shared. We'll try to find one.
      const platformIds = ['meta', 'x', 'linkedin', 'tiktok'];
      const token = platformIds.reduce<string | null>((foundToken, id) => {
        if (foundToken) return foundToken;
        return localStorage.getItem(`${id}_jwt`);
      }, null);

      if (!token) {
        setScheduleStatus({ type: 'error', message: 'You must connect at least one account in Branding to schedule posts.'});
        setIsScheduling(false);
        return;
      }

      try {
        const response = await fetch('/api/schedule-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                brand,
                platform,
                content: postContent,
                scheduleTime: new Date().toISOString()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to schedule post.');
        }

        setScheduleStatus({ type: 'success', message: data.message });
        setPostContent(''); // Clear content on success
      } catch (error) {
          const message = error instanceof Error ? error.message : 'An unknown error occurred.';
          setScheduleStatus({ type: 'error', message });
      } finally {
          setIsScheduling(false);
          setTimeout(() => setScheduleStatus(null), 4000); // Hide message after 4s
      }
  }

  const selectionMade = useMemo(() => {
      return brand && platform;
  }, [brand, platform]);

  const canSchedule = postContent.trim().length > 0 && selectionMade;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-4">
            <h3 className="text-md font-semibold text-gray-200 mb-1">Plan Your Content</h3>
            <p className="text-sm text-gray-400 mb-4">Select the brand and platform for your new post.</p>
            <div className="space-y-3">
                <StyledSelect label="Brand" id="client-brand" options={brands} value={brand} onChange={e => setBrand(e.target.value)} />
                <StyledSelect label="Platform" id="client-platform" options={platforms} value={platform} onChange={e => setPlatform(e.target.value)} />
            </div>
            {selectionMade && (
                <div className="animate-fade-in">
                    <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center gap-3">
                        <Icon name="check-circle" className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300">Target Selected</h4>
                            <p className="text-xs text-gray-400">
                                Planning for: <span className="font-medium text-gray-300">{brand.charAt(0).toUpperCase() + brand.slice(1)} on {platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                            </p>
                        </div>
                    </div>
                     <div className="mt-4">
                        <button
                            onClick={handleGenerateIdeas}
                            disabled={isGenerating}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors border border-gray-600 hover:bg-gray-700 text-gray-300 disabled:opacity-50"
                        >
                            <Icon name="sparkles" className={`w-5 h-5 ${isGenerating ? 'animate-pulse' : ''}`} />
                            <span>{isGenerating ? 'Generating Ideas...' : 'Generate Ideas with AI'}</span>
                        </button>
                    </div>
                    {generationError && <p className="mt-2 text-sm text-red-400">{generationError}</p>}
                    {ideas.length > 0 && (
                    <div className="mt-4 space-y-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700 animate-fade-in">
                        <h4 className="text-sm font-semibold text-gray-300">Here are some ideas:</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
                        {ideas.map((idea, index) => (
                            <li key={index} className="hover:text-white cursor-pointer" onClick={() => setPostContent(prev => prev ? `${prev}\n\n${idea}` : idea)}>
                            {idea}
                            </li>
                        ))}
                        </ul>
                    </div>
                    )}
                </div>
            )}
        </div>
        
        {/* Shared Content Area */}
        <div className="p-4">
            <label htmlFor="post-content" className="block text-sm font-medium text-gray-400 mb-1">
                Post Content
            </label>
            <textarea
                id="post-content"
                rows={8}
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                placeholder="What do you want to share?"
            />
        </div>
      </div>
      
      {/* Shared Footer/Action Area */}
      <div className="p-4 border-t border-gray-700/50 mt-auto flex-shrink-0">
         {scheduleStatus && (
            <div className={`mb-3 p-2 text-center text-sm rounded-md animate-fade-in ${
                scheduleStatus.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
            }`}>
                {scheduleStatus.message}
            </div>
        )}
        <button
            onClick={handleSchedule}
            disabled={!canSchedule || isScheduling}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
            {isScheduling ? (
                <Icon name="loader" className="w-5 h-5 animate-spin" />
            ) : (
                <Icon name="calendar" className="w-5 h-5" />
            )}
            <span>{isScheduling ? 'Scheduling...' : 'Schedule Post'}</span>
        </button>
      </div>
    </div>
  );
};

export default ContentPlanner;