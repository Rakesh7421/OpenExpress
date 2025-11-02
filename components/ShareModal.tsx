
import React, { useState } from 'react';
import { Icon } from './common/Icon';

interface ShareModalProps {
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const shareUrl = "https://openexpress.app/share/design_abc123";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Share this design</h3>
        <p className="text-sm text-gray-400 mb-4">
          Anyone with this link can view a read-only version of your design.
        </p>
        
        <div className="flex items-center space-x-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition font-mono text-sm"
          />
          <button
            onClick={handleCopyLink}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors w-32 flex-shrink-0 ${
              copyStatus === 'copied' 
              ? 'bg-green-600 text-white' 
              : 'bg-brand-600 hover:bg-brand-500 text-white'
            }`}
          >
            {copyStatus === 'copied' ? (
              <Icon name="check-circle" className="w-5 h-5" />
            ) : (
              <Icon name="share" className="w-5 h-5" />
            )}
            <span>{copyStatus === 'copied' ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <Icon name="x" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
