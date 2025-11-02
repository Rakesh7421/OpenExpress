
import React from 'react';
import { AppVersion, DesignElement } from '../types';
import { ToggleSwitch } from './common/ToggleSwitch';
import { Icon } from './common/Icon';

interface HeaderProps {
  version: AppVersion;
  onVersionChange: (newVersion: AppVersion) => void;
  elements: DesignElement[];
  onShare: () => void;
}

const Header: React.FC<HeaderProps> = ({ version, onVersionChange, elements, onShare }) => {
  const handleExport = () => {
    if (elements.length === 0) {
      alert("Canvas is empty. Add some elements before exporting.");
      return;
    }

    const jsonString = JSON.stringify(elements, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700/50 shadow-md h-16 flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xl font-bold text-brand-400">
           <Icon name="logo" className="w-8 h-8"/>
           <span>OpenExpress</span>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
         <ToggleSwitch
            version={version}
            onVersionChange={onVersionChange}
         />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          <Icon name="share" className="w-4 h-4" />
          <span>Share</span>
        </button>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors">
          <Icon name="download" className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
