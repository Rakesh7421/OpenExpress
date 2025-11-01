import React, { useState, useCallback } from 'react';
import { AppVersion } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import ContentPanel from './components/ContentPanel';

export default function App(): React.ReactElement {
  const [version, setVersion] = useState<AppVersion>(AppVersion.DEVELOPER);
  const [activeSidebarItem, setActiveSidebarItem] = useState<string | null>('server');
  const [pushedFeatures, setPushedFeatures] = useState<Set<string>>(new Set());

  const handleVersionChange = useCallback((newVersion: AppVersion) => {
    setVersion(newVersion);
    const developerOnlyItems = ['ai', 'branding', 'collaboration', 'version-control', 'integrations', 'push', 'server'];
    if (newVersion === AppVersion.CLIENT && activeSidebarItem && developerOnlyItems.includes(activeSidebarItem)) {
        setActiveSidebarItem(null);
    }
  }, [activeSidebarItem]);

  const handleSidebarItemSelect = useCallback((itemId: string) => {
    setActiveSidebarItem(prev => (prev === itemId ? null : itemId));
  }, []);

  const handleTogglePushFeature = useCallback((featureId: string) => {
    setPushedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      <Header version={version} onVersionChange={handleVersionChange} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          version={version}
          activeItem={activeSidebarItem}
          onSelectItem={handleSidebarItemSelect}
          pushedFeatures={pushedFeatures}
        />
        {activeSidebarItem &&
          <ContentPanel
            key={activeSidebarItem}
            activeItem={activeSidebarItem}
            onClose={() => setActiveSidebarItem(null)}
            version={version}
            pushedFeatures={pushedFeatures}
            onTogglePushFeature={handleTogglePushFeature}
          />
        }
        <main className="flex-1 flex items-center justify-center p-4 bg-gray-800/50">
          <Canvas />
        </main>
        <RightPanel version={version} />
      </div>
    </div>
  );
}