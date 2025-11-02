import React from 'react';
import { AppVersion, DesignElement } from '../types';
import { ToggleSwitch } from './common/ToggleSwitch';
import { Icon } from './common/Icon';

interface HeaderProps {
  version: AppVersion;
  onVersionChange: (newVersion: AppVersion) => void;
  elements: DesignElement[];
  onShare: () => void;
  serverStatus: 'connecting' | 'online' | 'offline';
}

const ServerStatusIndicator: React.FC<{ status: HeaderProps['serverStatus'] }> = ({ status }) => {
  const statusConfig = {
    online: { text: 'Server Online', color: 'bg-green-500', textColor: 'text-green-300' },
    offline: { text: 'Server Offline', color: 'bg-red-500', textColor: 'text-red-300' },
    connecting: { text: 'Connecting...', color: 'bg-yellow-500', textColor: 'text-yellow-300' },
  };

  const { text, color, textColor } = statusConfig[status];

  return (
    <div 
      className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full border border-gray-700"
      title={status === 'offline' ? 'The backend server is not reachable. Some features may not work.' : 'Connection status to the backend server.'}
    >
      <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
      <span className={`text-xs font-semibold ${textColor}`}>{text}</span>
    </div>
  );
};


const Header: React.FC<HeaderProps> = ({ version, onVersionChange, elements, onShare, serverStatus }) => {
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
        <ServerStatusIndicator status={serverStatus} />
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