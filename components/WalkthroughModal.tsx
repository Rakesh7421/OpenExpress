import React, { useState, useEffect } from 'react';
import { Icon } from './common/Icon';
import { PlatformName } from './BrandingContent';
import * as SharedMetaWalkthrough from '../walkthroughs/shared-meta';
import * as FacebookWalkthrough from '../walkthroughs/facebook';
import * as InstagramWalkthrough from '../walkthroughs/instagram';
import * as PinterestWalkthrough from '../walkthroughs/pinterest';

interface WalkthroughModalProps {
  platform: PlatformName;
  onClose: () => void;
}

// A simple markdown renderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const renderLine = (line: string, index: number) => {
        if (line.startsWith('# ')) {
            return <h2 key={index} className="text-xl font-bold mt-4 mb-2 text-white pb-2 border-b border-gray-600">{line.substring(2)}</h2>;
        }
        if (line.startsWith('## ')) {
            return <h3 key={index} className="text-lg font-semibold mt-3 mb-1 text-gray-200">{line.substring(3)}</h3>;
        }
        if (line.startsWith('### ')) {
            return <h4 key={index} className="text-md font-semibold mt-2 text-gray-300">{line.substring(4)}</h4>;
        }
        if (line.startsWith('- ')) {
            // This is a simple list item, not a full list implementation
            return <li key={index} className="text-gray-400 list-disc ml-5">{line.substring(2)}</li>;
        }
        if (line.match(/^\d+\.\s/)) {
             return <li key={index} className="text-gray-400 list-decimal ml-5">{line.substring(line.indexOf(' ') + 1)}</li>;
        }
        if (line.trim() === '') {
            return <br key={index} />;
        }
        // Render links and bold text
        const linkedText = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-400 hover:underline">$1</a>');
        const boldedText = linkedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        const codeText = boldedText.replace(/`(.*?)`/g, '<code class="text-xs bg-gray-700 p-1 rounded font-mono text-brand-300">$1</code>');

        return <p key={index} className="text-gray-400 my-2" dangerouslySetInnerHTML={{ __html: codeText }} />;
    };

    return (
        <div className="prose prose-sm prose-invert max-w-none">
            {content.split('\n').map(renderLine)}
        </div>
    );
};


const WalkthroughModal: React.FC<WalkthroughModalProps> = ({ platform, onClose }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let walkthroughContent = '';
    switch (platform) {
      case 'Facebook':
        walkthroughContent = SharedMetaWalkthrough.content + '\n\n' + FacebookWalkthrough.content;
        break;
      case 'Instagram':
        walkthroughContent = SharedMetaWalkthrough.content + '\n\n' + InstagramWalkthrough.content;
        break;
      case 'Pinterest':
        walkthroughContent = PinterestWalkthrough.content;
        break;
      default:
        walkthroughContent = '## No guide available for this platform.';
    }
    setContent(walkthroughContent);
    setIsLoading(false);
  }, [platform]);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full max-w-2xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
             <h3 className="text-lg font-semibold text-white">Setup Guide for {platform}</h3>
             <button
                onClick={onClose}
                className="p-1.5 text-gray-500 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
             >
                <Icon name="x" className="w-4 h-4" />
             </button>
        </div>

        <div className="overflow-y-auto pr-4 flex-1">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Icon name="loader" className="w-8 h-8 animate-spin text-brand-500" />
                </div>
            ) : (
                <MarkdownRenderer content={content} />
            )}
        </div>
      </div>
    </div>
  );
};

export default WalkthroughModal;