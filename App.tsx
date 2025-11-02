import React, { useState, useCallback, useEffect } from 'react';
import { AppVersion, DesignElement } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import ContentPanel from './components/ContentPanel';
import ShareModal from './components/ShareModal';

export default function App(): React.ReactElement {
  const [version, setVersion] = useState<AppVersion>(AppVersion.DEVELOPER);
  const [activeSidebarItem, setActiveSidebarItem] = useState<string | null>('planner');
  const [pushedFeatures, setPushedFeatures] = useState<Set<string>>(new Set());
  const [canvasElements, setCanvasElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/status');
        if (response.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch (error) {
        setServerStatus('offline');
      }
    };

    checkServerStatus(); // Initial check
    const intervalId = setInterval(checkServerStatus, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);


  const handleVersionChange = useCallback((newVersion: AppVersion) => {
    setVersion(newVersion);
    const developerOnlyItems = ['ai', 'branding', 'collaboration', 'version-control', 'integrations', 'push', 'server', 'checklist'];
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
  
  const addCanvasElement = useCallback((element: Omit<DesignElement, 'id'>) => {
    const newElement = { ...element, id: `el_${Date.now()}` } as DesignElement;
    setCanvasElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  }, []);

  const updateCanvasElement = useCallback((elementId: string, updatedProperties: Partial<DesignElement>) => {
    setCanvasElements(prev => 
      prev.map(el => 
        el.id === elementId ? ({ ...el, ...updatedProperties } as DesignElement) : el
      )
    );
  }, []);

  const handleSelectElement = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId);
  }, []);


  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      <Header 
        version={version} 
        onVersionChange={handleVersionChange}
        elements={canvasElements}
        onShare={() => setIsShareModalOpen(true)}
        serverStatus={serverStatus}
      />
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
            onAddElement={addCanvasElement}
          />
        }
        <main className="flex-1 flex items-center justify-center p-4 bg-gray-800/50">
          <Canvas
            elements={canvasElements}
            selectedElementId={selectedElementId}
            onSelectElement={handleSelectElement}
            onUpdateElement={updateCanvasElement}
           />
        </main>
        <RightPanel 
          version={version} 
          elements={canvasElements}
          selectedElementId={selectedElementId}
          onUpdateElement={updateCanvasElement}
          onSelectElement={handleSelectElement}
        />
      </div>
      {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} />}
    </div>
  );
}