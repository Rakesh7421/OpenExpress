
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Icon } from './common/Icon';
import { DesignElement, ElementType, TextElement, ShapeElement, ShapeType } from '../types';

interface CanvasProps {
    elements: DesignElement[];
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (id: string, updatedProperties: Partial<DesignElement>) => void;
}

const DraggableElement: React.FC<{
    element: DesignElement;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onUpdate: (id: string, updatedProperties: Partial<DesignElement>) => void;
}> = ({ element, isSelected, onSelect, onUpdate }) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        onSelect(element.id);
        setIsDragging(true);
        dragStartPos.current = { x: e.clientX - element.x, y: e.clientY - element.y };
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        const newX = e.clientX - dragStartPos.current.x;
        const newY = e.clientY - dragStartPos.current.y;
        onUpdate(element.id, { x: newX, y: newY });
    }, [isDragging, element.id, onUpdate]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const renderElementContent = () => {
        switch (element.type) {
            case ElementType.TEXT:
                const textEl = element as TextElement;
                return <div
                    style={{
                        fontSize: `${textEl.fontSize}px`,
                        color: textEl.color,
                        fontFamily: textEl.fontFamily,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        userSelect: 'none',
                    }}
                >{textEl.content}</div>;
            case ElementType.SHAPE:
                const shapeEl = element as ShapeElement;
                return <div
                    style={{
                        backgroundColor: shapeEl.backgroundColor,
                        borderRadius: shapeEl.shapeType === ShapeType.ELLIPSE ? '50%' : '0',
                        width: '100%',
                        height: '100%',
                    }}
                />;
            default:
                return null;
        }
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`,
                transform: `rotate(${element.rotation}deg)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                border: isSelected ? '2px solid #38bdf8' : 'none',
                boxSizing: 'border-box',
            }}
        >
            {renderElementContent()}
        </div>
    );
};


const Canvas: React.FC<CanvasProps> = ({ elements, selectedElementId, onSelectElement, onUpdateElement }) => {
    const [zoom, setZoom] = useState(100);

    const handleZoomIn = () => setZoom(z => Math.min(z + 10, 200));
    const handleZoomOut = () => setZoom(z => Math.max(z - 10, 20));

  return (
    <div className="relative w-full h-full flex items-center justify-center">
        {/* The Artboard */}
        <div 
            className="bg-white shadow-2xl rounded-lg overflow-hidden transition-transform duration-300 relative"
            style={{ 
                width: '800px', 
                height: '600px', 
                transform: `scale(${zoom / 100})` 
            }}
            onClick={(e) => {
                if(e.target === e.currentTarget) {
                    onSelectElement(null)
                }
            }}
        >
            {elements.length === 0 && (
                 <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 to-purple-100">
                    <h1 className="text-4xl font-bold text-gray-500">Canvas is empty</h1>
                    <p className="mt-2 text-lg text-gray-400">Add elements from the left sidebar.</p>
                </div>
            )}
            {elements.map(el => (
                <DraggableElement
                    key={el.id}
                    element={el}
                    isSelected={el.id === selectedElementId}
                    onSelect={onSelectElement}
                    onUpdate={onUpdateElement}
                />
            ))}
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex items-center bg-gray-900/80 backdrop-blur-sm p-1 rounded-lg shadow-lg border border-gray-700/50">
            <button onClick={handleZoomOut} className="p-2 text-gray-400 hover:text-white rounded-md transition-colors">
                <Icon name="minus" className="w-5 h-5"/>
            </button>
            <span className="px-3 text-sm font-semibold w-16 text-center">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-2 text-gray-400 hover:text-white rounded-md transition-colors">
                <Icon name="plus" className="w-5 h-5"/>
            </button>
        </div>
    </div>
  );
};

export default Canvas;
