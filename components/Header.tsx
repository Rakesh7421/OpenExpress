import React, { useState } from 'react';
import { AppVersion } from '../types';
import { Icon } from './common/Icon';
import { ToggleSwitch } from './common/ToggleSwitch';
import ShareModal from './ShareModal';

interface HeaderProps {
  version: AppVersion;
  onVersionChange: (newVersion: AppVersion) => void;
}

const Header: React.FC<HeaderProps> = ({ version, onVersionChange }) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    
    return (
        <>
            <header className="bg-gray-900 border-b border-gray-700/50 p-2 flex items-center justify-between flex-shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-lg font-bold text-white">
                        <Icon name="logo" className="w-8 h-8 text-brand-500" />
                        <span>OpenExpress</span>
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <ToggleSwitch version={version} onVersionChange={onVersionChange} />
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsShareModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors"
                    >
                        <Icon name="share" className="w-4 h-4" />
                        <span>Share</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                        <Icon name="download" className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </div>
            </header>
            {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} />}
        </>
    );
};

export default Header;
