
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import ContentPanel from './components/ContentPanel';
import { AppVersion, DesignElement, ElementType, ShapeType, TextElement, ShapeElement } from './types';

const initialElements: DesignElement[] = [
    {
        id: uuidv4(),
        type: ElementType.TEXT,
        x: 50,
        y: 50,
        width: 300,
        height: 50,
        rotation: 0,
        content: 'Welcome to OpenExpress!',
        fontSize: 32,
        color: '#333333',
        fontFamily: 'Arial',
    },
    {
        id: uuidv4(),
        type: ElementType.SHAPE,
        shapeType: ShapeType.RECTANGLE,
        x: 400,
        y: 150,
        width: 200,
        height: 100,
        rotation: 15,
        backgroundColor: '#38bdf8',
        borderColor: '#0ea5e9',
        borderWidth: 2,
    }
];


const App: React.FC = () => {
    const [version, setVersion] = useState<AppVersion>(AppVersion.DEVELOPER);
    const [elements, setElements] = useState<DesignElement[]>(initialElements);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [activeSidebarItem, setActiveSidebarItem] = useState<string>('templates');
    const [pushedFeatures, setPushedFeatures] = useState<Set<string>>(new Set(['ai', 'planner']));

    const handleVersionChange = (newVersion: AppVersion) => {
        setVersion(newVersion);
    };

    const handleSelectElement = (id: string | null) => {
        setSelectedElementId(id);
    };

    const handleUpdateElement = useCallback((id: string, updatedProperties: Partial<DesignElement>) => {
        setElements(prevElements =>
            prevElements.map(el =>
                el.id === id ? { ...el, ...updatedProperties } : el
            )
        );
    }, []);
    
    const addElement = (element: Omit<DesignElement, 'id'>) => {
        // FIX: Spreading a discriminated union like `Omit<DesignElement, 'id'>` can widen
        // the resulting type, losing the specific `TextElement` or `ShapeElement` form.
        // Using a ternary operator with a check on the discriminant property (`type`)
        // allows TypeScript to correctly create and infer the type in each branch.
        const newElement: DesignElement =
            element.type === ElementType.TEXT
                ? { ...element, id: uuidv4() }
                : { ...element, id: uuidv4() };

        setElements(prev => [...prev, newElement]);
        setSelectedElementId(newElement.id);
    }
    
    const handleSelectSidebarItem = (itemId: string) => {
        setActiveSidebarItem(itemId);
        if (itemId === 'text') {
             addElement({
                type: ElementType.TEXT,
                x: 100,
                y: 120,
                width: 250,
                height: 40,
                rotation: 0,
                content: 'New Text Element',
                fontSize: 24,
                color: '#000000',
                fontFamily: 'Helvetica',
            } as Omit<TextElement, 'id'>);
            // Switch back to a view where canvas is visible to avoid confusion
            setActiveSidebarItem('templates'); 
        } else if (itemId === 'shapes') {
            addElement({
                type: ElementType.SHAPE,
                shapeType: ShapeType.ELLIPSE,
                x: 200,
                y: 200,
                width: 100,
                height: 100,
                rotation: 0,
                backgroundColor: '#f43f5e',
                borderColor: '#be123c',
                borderWidth: 0,
            } as Omit<ShapeElement, 'id'>);
            // Switch back to a view where canvas is visible
            setActiveSidebarItem('templates'); 
        }
    };

    // Determine which main view to show. Some sidebar items open a full-screen content panel.
    const isCanvasVisible = !['planner', 'ai', 'feature-analysis', 'branding', 'server', 'checklist', 'push', 'collaboration', 'version-control', 'integrations'].includes(activeSidebarItem);

    return (
        <div className="flex flex-col h-screen bg-gray-800 text-white font-sans">
            <Header version={version} onVersionChange={handleVersionChange} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar 
                    version={version} 
                    activeItem={activeSidebarItem} 
                    onSelectItem={handleSelectSidebarItem} 
                    pushedFeatures={pushedFeatures}
                />
                <main className="flex flex-1 overflow-hidden">
                    {isCanvasVisible ? (
                         <div className="flex flex-1 relative bg-gray-700">
                             <Canvas
                                elements={elements}
                                selectedElementId={selectedElementId}
                                onSelectElement={handleSelectElement}
                                onUpdateElement={handleUpdateElement}
                            />
                            <RightPanel
                                version={version}
                                elements={elements}
                                selectedElementId={selectedElementId}
                                onUpdateElement={handleUpdateElement}
                                onSelectElement={handleSelectElement}
                            />
                         </div>
                    ) : (
                        <ContentPanel activePanel={activeSidebarItem} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
