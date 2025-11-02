
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Icon } from '../common/Icon';
import { Post, BrandConfig, PlatformName } from '../../types';
import { AppConfig } from '../../config/appConfig';

interface SchedulePostModalProps {
  onClose: () => void;
  onSchedule: (posts: Omit<Post, 'id' | 'status'>[]) => void;
  selectedDate: Date | null;
  appConfig: AppConfig;
  brandConfig: BrandConfig;
}

const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ onClose, onSchedule, selectedDate, appConfig, brandConfig }) => {
    const [baseContent, setBaseContent] = useState('');
    const [scheduledAt, setScheduledAt] = useState(selectedDate || new Date());
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
    const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
    
    const availableAccounts = useMemo(() => {
        const accounts: {id: string, name: string, platform: PlatformName, brand: string}[] = [];
        Object.entries(appConfig.users).forEach(([userName, user]) => {
            Object.entries(user.brands).forEach(([brandName, brand]) => {
                Object.entries(brand.platforms).forEach(([platformName, platform]) => {
                    if (platform.dev.tokens.user || platform.live.tokens.user) {
                        // Simulate a unique account ID and name
                        const accountId = `${platformName.toLowerCase()}-${brandName.toLowerCase()}`;
                        accounts.push({
                            id: accountId,
                            name: `${platformName} (${brandName})`,
                            platform: platformName as PlatformName,
                            brand: brandName
                        });
                    }
                });
            });
        });
        return accounts;
    }, [appConfig]);

    useEffect(() => {
        // Pre-select default accounts from the brand profile
        const defaultAccounts = brandConfig.details.postingDefaults.defaultAccounts || [];
        setSelectedAccounts(new Set(defaultAccounts));
    }, [brandConfig]);
    
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

    const handleMediaChange = (files: FileList | null) => {
        const file = files?.[0];
        if (file) {
            setMediaFile(file);
            setMediaPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!baseContent.trim() && !mediaFile) return alert('Post must have content or media.');
        if (selectedAccounts.size === 0) return alert('Please select at least one account to post to.');

        const hashtags = brandConfig.details.postingDefaults.mandatoryHashtags || '';
        const contentWithHashtags = `${baseContent}\n\n${hashtags}`.trim();

        const newPosts = Array.from(selectedAccounts).map(accountId => {
            const account = availableAccounts.find(a => a.id === accountId)!;
            return {
                platform: account.platform,
                accountId: account.id,
                accountName: account.name,
                content: contentWithHashtags,
                scheduledAt,
                mediaUrl: mediaPreviewUrl || undefined
            };
        });
        
        onSchedule(newPosts);
    };
    
    const toLocalISOString = (date: Date) => {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, -1);
        return localISOTime.substring(0, 16);
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full max-w-2xl relative grid grid-cols-3 gap-6" onClick={(e) => e.stopPropagation()}>
                
                {/* Left Side: Content & Media */}
                <div className="col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Schedule a New Post</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                        <textarea value={baseContent} onChange={(e) => setBaseContent(e.target.value)} rows={8} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" placeholder="What's on your mind?" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Media</label>
                        {mediaPreviewUrl ? (
                             <div className="relative">
                                {mediaFile?.type.startsWith('video/') ? (<video src={mediaPreviewUrl} controls className="w-full rounded-md max-h-40" />) : (<img src={mediaPreviewUrl} alt="Media preview" className="w-full rounded-md max-h-40 object-contain" />)}
                                <button onClick={() => setMediaPreviewUrl(null)} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/80"><Icon name="x" className="w-4 h-4" /></button>
                             </div>
                        ) : (
                            <div className="relative flex justify-center w-full h-24 px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <Icon name="upload" className="mx-auto h-8 w-8 text-gray-400" />
                                    <div className="flex text-xs text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-brand-400 hover:text-brand-300">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleMediaChange(e.target.files)} accept="image/*,video/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Accounts & Scheduling */}
                <div className="col-span-1 space-y-4 bg-gray-900/50 p-4 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Post to</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-gray-600 rounded-md">
                            {availableAccounts.map(account => (
                                <label key={account.id} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-700">
                                    <input type="checkbox" checked={selectedAccounts.has(account.id)} onChange={() => handleAccountToggle(account.id)} className="w-4 h-4 rounded accent-brand-500 bg-gray-700 border-gray-500"/>
                                    <Icon name={account.platform.toLowerCase()} className="w-4 h-4"/>
                                    <span className="text-sm">{account.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Schedule Date</label>
                         <input type="datetime-local" value={toLocalISOString(scheduledAt)} onChange={(e) => setScheduledAt(new Date(e.target.value))} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"/>
                    </div>
                    {brandConfig.details.postingDefaults.mandatoryHashtags && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Mandatory Hashtags</label>
                            <p className="text-xs text-gray-400 p-2 bg-gray-700 rounded-md">{brandConfig.details.postingDefaults.mandatoryHashtags}</p>
                        </div>
                    )}
                    <div className="flex flex-col gap-2 pt-2">
                        <button onClick={handleSubmit} className="w-full px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg">Schedule Post</button>
                        <button type="button" onClick={onClose} className="w-full px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePostModal;
