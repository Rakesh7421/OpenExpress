import React, { useState, useCallback } from 'react';
import { AppVersion, DesignElement, ElementType, TextElement, ShapeElement, ShapeType } from './types';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import Header from './components/Header';
import ContentPanel from './components/ContentPanel';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [version, setVersion] = useState<AppVersion>(AppVersion.DEVELOPER);
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeSidebarItem, setActiveSidebarItem] = useState<string | null>('text');
  const [pushedFeatures, setPushedFeatures] = useState<Set<string>>(new Set(['planner', 'branding', 'feature-analysis', 'server']));

  const handleVersionChange = (newVersion: AppVersion) => {
    setVersion(newVersion);
  };

  const handleSelectElement = (id: string | null) => {
    setSelectedElementId(id);
    if (id) {
        setActiveSidebarItem(null);
    }
  };

  const handleUpdateElement = useCallback((id: string, updatedProperties: Partial<DesignElement>) => {
    setElements(prevElements =>
      prevElements.map(el =>
        // FIX: Add type assertion to resolve TypeScript union type issue.
        el.id === id ? { ...el, ...updatedProperties } as DesignElement : el
      )
    );
  }, []);

  const addElement = (type: ElementType) => {
    let newElement: DesignElement;
    const baseElement = {
        id: uuidv4(),
        x: 150,
        y: 100,
        width: 150,
        height: 50,
        rotation: 0,
    };

    if (type === ElementType.TEXT) {
        newElement = {
            ...baseElement,
            type: ElementType.TEXT,
            content: 'Hello World',
            fontSize: 24,
            color: '#000000',
            fontFamily: 'Arial',
        } as TextElement;
    } else if (type === ElementType.SHAPE) {
        newElement = {
            ...baseElement,
            width: 100,
            height: 100,
            type: ElementType.SHAPE,
            shapeType: ShapeType.RECTANGLE,
            backgroundColor: '#38bdf8',
            borderColor: '#000000',
            borderWidth: 0,
        } as ShapeElement;
    } else {
        return;
    }
    setElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  }

  const handleSelectItem = (itemId: string) => {
    setActiveSidebarItem(itemId);
    setSelectedElementId(null);
  }

  return (
    <div className="bg-gray-800 text-white h-screen flex flex-col font-sans antialiased overflow-hidden">
      <Header version={version} onVersionChange={handleVersionChange} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar version={version} activeItem={activeSidebarItem} onSelectItem={handleSelectItem} pushedFeatures={pushedFeatures} />
        <ContentPanel activeTab={activeSidebarItem} onAddElement={addElement} />
        <main className="flex-1 bg-gray-700 flex items-center justify-center p-4">
          <Canvas 
            elements={elements} 
            selectedElementId={selectedElementId} 
            onSelectElement={handleSelectElement} 
            onUpdateElement={handleUpdateElement} 
          />
        </main>
        <RightPanel 
            version={version} 
            elements={elements} 
            selectedElementId={selectedElementId} 
            onUpdateElement={handleUpdateElement} 
            onSelectElement={handleSelectElement}
        />
      </div>
    </div>
  );
};

export default App;