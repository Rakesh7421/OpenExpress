
import React, { useMemo, useCallback } from 'react';
// FIX: Added ImageElement for more specific type in onUpdateElement prop.
import { AppVersion, DesignElement, ElementType, TextElement, ShapeElement, ImageElement } from '../types';
import { getDesignSuggestions } from '../services/geminiService';
import { Icon } from './common/Icon';

interface RightPanelProps {
  version: AppVersion;
  elements: DesignElement[];
  selectedElementId: string | null;
  // FIX: Updated updatedProperties to be a partial of a union of element types for type safety.
  onUpdateElement: (id: string, updatedProperties: Partial<TextElement | ShapeElement | ImageElement>) => void;
  onSelectElement: (id: string | null) => void;
}

const AISuggestionsPanel: React.FC = () => {
    const [prompt, setPrompt] = React.useState<string>("A modern, minimalist design for a coffee shop's social media post");
    const [suggestions, setSuggestions] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setSuggestions('');
        try {
            const result = await getDesignSuggestions(prompt);
            setSuggestions(result);
        } catch (e) {
            setError('Failed to get suggestions. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    const handleSave = useCallback(() => {
        if (!suggestions) return;

        const blob = new Blob([suggestions], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'design-suggestions.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [suggestions]);


    return (
        <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Icon name="sparkles" className="w-5 h-5 text-brand-400" />
                AI Design Suggestions
            </h3>
            <div className="space-y-2">
                <label htmlFor="ai-prompt" className="text-sm font-medium text-gray-400">Describe your idea</label>
                <textarea
                    id="ai-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                    placeholder="e.g., a promotional banner for a summer sale"
                />
            </div>
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Icon name="loader" className="w-5 h-5 animate-spin" />
                ) : (
                    <Icon name="wand" className="w-5 h-5" />
                )}
                <span>{isLoading ? 'Generating...' : 'Generate Ideas'}</span>
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {suggestions && (
                 <div className="relative mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
                    <button
                        onClick={handleSave}
                        className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors z-10"
                        title="Save Suggestions"
                        aria-label="Save design suggestions"
                    >
                        <Icon name="save" className="w-4 h-4" />
                    </button>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap font-mono pr-8">{suggestions}</p>
                </div>
            )}
        </div>
    );
};

const LayersPanel: React.FC<{
    elements: DesignElement[];
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
}> = ({ elements, selectedElementId, onSelectElement }) => {
    const getLayerName = (element: DesignElement) => {
        switch (element.type) {
            case ElementType.TEXT:
                return (element as TextElement).content.substring(0, 20) || 'Text Layer';
            case ElementType.SHAPE:
                return `${(element as ShapeElement).shapeType.charAt(0).toUpperCase() + (element as ShapeElement).shapeType.slice(1)} Shape`;
            default:
                return 'Layer';
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Layers</h3>
            <div className="space-y-2">
                {[...elements].reverse().map(element => (
                    <div 
                        key={element.id} 
                        onClick={() => onSelectElement(element.id)}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                            selectedElementId === element.id 
                                ? 'bg-brand-500/20' 
                                : 'bg-gray-800 hover:bg-gray-700/50'
                        }`}
                    >
                        <span className="text-sm truncate">{getLayerName(element)}</span>
                        <Icon name="eye" className="w-4 h-4 text-gray-400" />
                    </div>
                ))}
                {elements.length === 0 && <p className="text-xs text-gray-500 text-center py-4">No layers yet.</p>}
            </div>
        </div>
    );
};


const PropertyInput: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
    <div>
        <label className="text-xs text-gray-400 font-medium">{label}</label>
        <div className="mt-1">
            {children}
        </div>
    </div>
);

const ElementPropertiesPanel: React.FC<{
    selectedElement: DesignElement;
    // FIX: Updated updatedProperties to be a partial of a union of element types for type safety.
    onUpdateElement: (id: string, updatedProperties: Partial<TextElement | ShapeElement | ImageElement>) => void;
}> = ({ selectedElement, onUpdateElement }) => {
    
    // FIX: Refactor handleUpdate to accept a partial properties object for better type safety.
    // The parameter type is now more specific to what properties can be updated.
    const handleUpdate = (updatedProperties: Partial<TextElement | ShapeElement>) => {
        onUpdateElement(selectedElement.id, updatedProperties);
    };

    const renderTextProperties = (element: TextElement) => (
        <>
            <PropertyInput label="Content">
                <textarea 
                    value={element.content} 
                    // FIX: Pass an object to handleUpdate. This call is now type-safe.
                    onChange={e => handleUpdate({ content: e.target.value })}
                    rows={4}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm"
                />
            </PropertyInput>
            <PropertyInput label="Font Size">
                 <input 
                    type="number"
                    value={element.fontSize} 
                    // FIX: Pass an object to handleUpdate. This call is now type-safe.
                    onChange={e => handleUpdate({ fontSize: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm"
                />
            </PropertyInput>
            <PropertyInput label="Color">
                 <input 
                    type="color"
                    value={element.color} 
                    // FIX: Pass an object to handleUpdate. This call is now type-safe.
                    onChange={e => handleUpdate({ color: e.target.value })}
                    className="w-full h-10 p-1 bg-gray-800 border border-gray-600 rounded-md cursor-pointer"
                />
            </PropertyInput>
        </>
    );

     const renderShapeProperties = (element: ShapeElement) => (
        <>
            <PropertyInput label="Background Color">
                 <input 
                    type="color"
                    value={element.backgroundColor} 
                    // FIX: Pass an object to handleUpdate. This call is now type-safe.
                    onChange={e => handleUpdate({ backgroundColor: e.target.value })}
                    className="w-full h-10 p-1 bg-gray-800 border border-gray-600 rounded-md cursor-pointer"
                />
            </PropertyInput>
        </>
    );
    
    return (
        <div className="p-4 space-y-4">
             <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Properties</h3>
             <div className="space-y-3">
                 <div className="grid grid-cols-2 gap-3">
                     <PropertyInput label="X">
                         {/* FIX: Pass an object to handleUpdate. This call is now type-safe. */}
                         <input type="number" value={Math.round(selectedElement.x)} onChange={e => handleUpdate({ x: parseInt(e.target.value, 10) || 0 })} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm" />
                     </PropertyInput>
                      <PropertyInput label="Y">
                         {/* FIX: Pass an object to handleUpdate. This call is now type-safe. */}
                         <input type="number" value={Math.round(selectedElement.y)} onChange={e => handleUpdate({ y: parseInt(e.target.value, 10) || 0 })} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm" />
                     </PropertyInput>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                      <PropertyInput label="Width">
                         {/* FIX: Pass an object to handleUpdate. This call is now type-safe. */}
                         <input type="number" value={Math.round(selectedElement.width)} onChange={e => handleUpdate({ width: parseInt(e.target.value, 10) || 0 })} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm" />
                     </PropertyInput>
                      <PropertyInput label="Height">
                         {/* FIX: Pass an object to handleUpdate. This call is now type-safe. */}
                         <input type="number" value={Math.round(selectedElement.height)} onChange={e => handleUpdate({ height: parseInt(e.target.value, 10) || 0 })} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm" />
                     </PropertyInput>
                 </div>
                 {selectedElement.type === ElementType.TEXT && renderTextProperties(selectedElement as TextElement)}
                 {selectedElement.type === ElementType.SHAPE && renderShapeProperties(selectedElement as ShapeElement)}
             </div>
        </div>
    );
};


const RightPanel: React.FC<RightPanelProps> = ({ version, elements, selectedElementId, onUpdateElement, onSelectElement }) => {
    const selectedElement = useMemo(() => 
        elements.find(el => el.id === selectedElementId),
    [elements, selectedElementId]);

  return (
    <aside className="w-80 bg-gray-900 border-l border-gray-700/50 flex flex-col overflow-y-auto">
      {selectedElement ? (
        <ElementPropertiesPanel selectedElement={selectedElement} onUpdateElement={onUpdateElement} />
      ) : version === AppVersion.DEVELOPER ? (
        <>
            <AISuggestionsPanel/>
            <div className="border-t border-gray-700/50 my-2"></div>
            <LayersPanel elements={elements} selectedElementId={selectedElementId} onSelectElement={onSelectElement} />
        </>
      ) : (
        <div className="p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Edit</h3>
           <p className="text-sm text-gray-400">Select an element on the canvas to edit its properties.</p>
        </div>
      )}
    </aside>
  );
};

export default RightPanel;
