
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import ContentPanel from './components/ContentPanel';
// FIX: Added ShapeElement, ImageElement for more specific type in handleUpdateElement
import { AppVersion, DesignElement, ElementType, ShapeType, TextElement, ShapeElement, ImageElement } from './types';
import { v4 as uuidv4 } from 'uuid';
import { AppConfig, initialAppConfig } from './config/appConfig';


const App: React.FC = () => {
    const [version, setVersion] = useState<AppVersion>(AppVersion.CLIENT);
    const [elements, setElements] = useState<DesignElement[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [activeItem, setActiveItem] = useState<string>('planner'); // Default to planner
    const [pushedFeatures, setPushedFeatures] = useState<Set<string>>(new Set(['planner']));
    const [appConfig, setAppConfig] = useState<AppConfig>(initialAppConfig);

    const handleVersionChange = (newVersion: AppVersion) => {
        setVersion(newVersion);
    };

    const handleSelectItem = (itemId: string) => {
        setActiveItem(itemId);
    };

    const handleSelectElement = (id: string | null) => {
        setSelectedElementId(id);
    };

    // FIX: Updated updatedProperties to be a partial of a union of element types for type safety.
    const handleUpdateElement = useCallback((id: string, updatedProperties: Partial<TextElement | ShapeElement | ImageElement>) => {
        setElements(prevElements =>
            prevElements.map(el =>
                el.id === id ? { ...el, ...updatedProperties } : el
            )
        );
    }, []);
    
    const handleAddElement = (type: ElementType) => {
        let newElement: DesignElement;
        const baseElement = {
            id: uuidv4(),
            x: 100,
            y: 100,
            width: 150,
            height: 100,
            rotation: 0,
        };

        switch (type) {
            case ElementType.TEXT:
                newElement = {
                    ...baseElement,
                    type: ElementType.TEXT,
                    content: 'Hello World',
                    fontSize: 24,
                    fontFamily: 'Arial',
                    color: '#000000',
                    height: 50,
                } as TextElement;
                break;
            case ElementType.SHAPE:
                newElement = {
                    ...baseElement,
                    type: ElementType.SHAPE,
                    // FIX: Cast to ShapeElement to satisfy stricter object literal checks.
                    shapeType: ShapeType.RECTANGLE,
                    backgroundColor: '#38bdf8',
                } as ShapeElement;
                break;
            default:
                return;
        }
        setElements(prev => [...prev, newElement]);
        setSelectedElementId(newElement.id);
    }
    
    const handlePushFeature = (featureId: string) => {
        setPushedFeatures(prev => {
            const newSet = new Set(prev);
            if (newSet.has(featureId)) {
                newSet.delete(featureId);
            } else {
                newSet.add(featureId);
            }
            return newSet;
        });
    }

    const isDesignView = ['templates', 'text', 'images', 'shapes'].includes(activeItem);

    return (
        <div className="flex flex-col h-screen bg-gray-800 text-white font-sans overflow-hidden">
            <Header version={version} onVersionChange={handleVersionChange} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar version={version} activeItem={activeItem} onSelectItem={handleSelectItem} pushedFeatures={pushedFeatures} />
                <main className="flex flex-1 h-full">
                    {isDesignView ? (
                        <>
                            <ContentPanel 
                                activeItem={activeItem} 
                                onAddElement={handleAddElement} 
                                onPushFeature={handlePushFeature} 
                                version={version} 
                                pushedFeatures={pushedFeatures} 
                                appConfig={appConfig}
                                setAppConfig={setAppConfig}
                            />
                            <div className="flex-1 flex flex-col bg-gray-700">
                                <Canvas
                                    elements={elements}
                                    selectedElementId={selectedElementId}
                                    onSelectElement={handleSelectElement}
                                    onUpdateElement={handleUpdateElement}
                                />
                            </div>
                            <RightPanel
                                version={version}
                                elements={elements}
                                selectedElementId={selectedElementId}
                                onUpdateElement={handleUpdateElement}
                                onSelectElement={handleSelectElement}
                            />
                        </>
                    ) : (
                         <div className="flex-1 flex flex-col bg-gray-700">
                             <ContentPanel 
                                activeItem={activeItem} 
                                onAddElement={handleAddElement} 
                                onPushFeature={handlePushFeature} 
                                version={version} 
                                pushedFeatures={pushedFeatures}
                                appConfig={appConfig}
                                setAppConfig={setAppConfig}
                            />
                         </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
