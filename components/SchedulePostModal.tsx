
import React, { useState, useCallback } from 'react';
import { Icon } from './common/Icon';
import { Post } from '../types';

interface SchedulePostModalProps {
  onClose: () => void;
  onSchedule: (post: Omit<Post, 'id' | 'status'>) => void;
  selectedDate: Date | null;
}

const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ onClose, onSchedule, selectedDate }) => {
    const [platform, setPlatform] = useState('Meta');
    const [content, setContent] = useState('');
    const [scheduledAt, setScheduledAt] = useState(selectedDate || new Date());
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);

    const handleMediaChange = (files: FileList | null) => {
        const file = files?.[0];
        if (file) {
            setMediaFile(file);
            setMediaPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveMedia = () => {
        if (mediaPreviewUrl) {
            URL.revokeObjectURL(mediaPreviewUrl);
        }
        setMediaFile(null);
        setMediaPreviewUrl(null);
    };

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        handleMediaChange(event.dataTransfer.files);
    }, []);

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            alert('Content cannot be empty.');
            return;
        }
        // In a real app, we'd upload the mediaFile and get a URL.
        // For this simulation, we'll just use the local preview URL.
        // FIX: Added missing accountId and accountName properties to match the Post type.
        onSchedule({ platform, accountId: `${platform.toLowerCase()}-123`, accountName: `${platform} Account`, content, scheduledAt, mediaUrl: mediaPreviewUrl || undefined });
    };
    
    const toLocalISOString = (date: Date) => {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, -1);
        return localISOTime.substring(0, 16);
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full max-w-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-white mb-4">Schedule a New Post</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Platform</label>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                        >
                            <option>Meta</option>
                            <option>X</option>
                            <option>Instagram</option>
                            <option>LinkedIn</option>
                            <option>TikTok</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                            placeholder="What's on your mind?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Media</label>
                        {mediaPreviewUrl ? (
                             <div className="relative">
                                {mediaFile?.type.startsWith('video/') ? (
                                    <video src={mediaPreviewUrl} controls className="w-full rounded-md max-h-60" />
                                ) : (
                                    <img src={mediaPreviewUrl} alt="Media preview" className="w-full rounded-md max-h-60 object-contain" />
                                )}
                                <button onClick={handleRemoveMedia} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/80">
                                    <Icon name="x" className="w-4 h-4" />
                                </button>
                             </div>
                        ) : (
                            <div
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                className="relative flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md"
                            >
                                <div className="space-y-1 text-center">
                                    <Icon name="upload" className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-brand-400 hover:text-brand-300 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleMediaChange(e.target.files)} accept="image/*,video/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB; MP4, MOV up to 100MB</p>
                                </div>
                            </div>
                        )}
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Schedule Date</label>
                         <input
                            type="datetime-local"
                            value={toLocalISOString(scheduledAt)}
                            onChange={(e) => setScheduledAt(new Date(e.target.value))}
                            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg">
                            Schedule Post
                        </button>
                    </div>
                </form>

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-white rounded-full hover:bg-gray-700"
                    aria-label="Close modal"
                >
                    <Icon name="x" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default SchedulePostModal;
