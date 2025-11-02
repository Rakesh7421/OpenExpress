import React from 'react';
import { AppVersion } from '../types';
import { CLIENT_SIDEBAR_ITEMS, DEVELOPER_SIDEBAR_ITEMS } from '../constants';
import { Icon } from './common/Icon';

interface SidebarProps {
  version: AppVersion;
  activeItem: string | null;
  onSelectItem: (itemId: string) => void;
  pushedFeatures: Set<string>;
}

const Sidebar: React.FC<SidebarProps> = ({ version, activeItem, onSelectItem, pushedFeatures }) => {
  const getItems = () => {
    if (version === AppVersion.DEVELOPER) {
      return DEVELOPER_SIDEBAR_ITEMS;
    }
    
    const pushedDeveloperItems = DEVELOPER_SIDEBAR_ITEMS.filter(item => 
        pushedFeatures.has(item.id) &&
        !CLIENT_SIDEBAR_ITEMS.some(clientItem => clientItem.id === item.id)
    );

    return [...CLIENT_SIDEBAR_ITEMS, ...pushedDeveloperItems];
  };

  const items = getItems();

  return (
    <aside className="w-20 bg-gray-900 border-r border-gray-700/50 p-2 flex flex-col items-center gap-2 flex-shrink-0">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelectItem(item.id)}
          className={`w-full flex flex-col items-center justify-center p-2 rounded-lg aspect-square transition-colors duration-200 ${
            activeItem === item.id
              ? 'bg-brand-500/20 text-brand-400'
              : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
          }`}
          aria-label={item.label}
          aria-pressed={activeItem === item.id}
        >
          <div className="w-6 h-6">{item.icon}</div>
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;