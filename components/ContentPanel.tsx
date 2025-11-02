
import React from 'react';
import { AppVersion, DesignElement, ElementType, ShapeElement, ShapeType, TextElement } from '../types';
import { Icon } from './common/Icon';
import ContentPlanner from './ContentPlanner';
import FeatureAnalysisContent from './FeatureAnalysisContent';
import PlatformAuthTools from './PlatformAuthTools';
import BrandingContent from './BrandingContent'; // Import the new component
import { DEVELOPER_SIDEBAR_ITEMS } from '../constants';

// Props definition should match what's passed from App.tsx
interface ContentPanelProps {
  activeItem: string;
  onClose: () => void;
  version: AppVersion;
  pushedFeatures: Set<string>;
  onTogglePushFeature: (featureId: string) => void;
  onAddElement: (element: Omit<DesignElement, 'id'>) => void;
}

const TextContent: React.FC<{ onAddElement: (element: Omit<DesignElement, 'id'>) => void }> = ({ onAddElement }) => {
    const addText = (content: string, fontSize: number, width: number) => {
        // FIX: Object literal may only specify known properties, and 'content' does not exist in type 'Omit<DesignElement, "id">'.
        // By explicitly typing the object, we help TypeScript correctly handle the discriminated union.
        const newTextElement: Omit<TextElement, 'id'> = {
            type: ElementType.TEXT,
            content,
            fontSize,
            color: '#333333',
            fontFamily: 'Arial',
            x: 150,
            y: 150,
            width,
            height: fontSize * 1.5,
            rotation: 0,
        };
        onAddElement(newTextElement);
    };
    return (
        <div className="p-4 space-y-4">
            <h3 className="text-md font-semibold text-gray-200">Add Text</h3>
            <button onClick={() => addText('Headline', 48, 300)} className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                <span className="text-2xl font-bold">Add a heading</span>
            </button>
            <button onClick={() => addText('Subheading', 24, 250)} className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                <span className="text-lg font-semibold">Add a subheading</span>
            </button>
            <button onClick={() => addText('Body text, click to edit.', 16, 200)} className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                <span>Add body text</span>
            </button>
        </div>
    );
};

const ShapesContent: React.FC<{ onAddElement: (element: Omit<DesignElement, 'id'>) => void }> = ({ onAddElement }) => {
    const addShape = (shapeType: ShapeType) => {
        // FIX: Object literal may only specify known properties, and 'shapeType' does not exist in type 'Omit<DesignElement, "id">'.
        // By explicitly typing the object, we help TypeScript correctly handle the discriminated union.
        const newShapeElement: Omit<ShapeElement, 'id'> = {
            type: ElementType.SHAPE,
            shapeType,
            backgroundColor: '#cccccc',
            borderColor: '#333333',
            borderWidth: 0,
            x: 150,
            y: 150,
            width: 100,
            height: 100,
            rotation: 0,
        };
        onAddElement(newShapeElement);
    };
    return (
        <div className="p-4 space-y-4">
            <h3 className="text-md font-semibold text-gray-200">Add Shape</h3>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => addShape(ShapeType.RECTANGLE)} className="flex flex-col items-center p-2 bg-gray-700 hover:bg-gray-600 rounded-md aspect-square justify-center transition-colors">
                    <div className="w-12 h-12 bg-gray-400" />
                    <span className="text-xs mt-2">Rectangle</span>
                </button>
                <button onClick={() => addShape(ShapeType.ELLIPSE)} className="flex flex-col items-center p-2 bg-gray-700 hover:bg-gray-600 rounded-md aspect-square justify-center transition-colors">
                    <div className="w-12 h-12 bg-gray-400 rounded-full" />
                    <span className="text-xs mt-2">Ellipse</span>
                </button>
            </div>
        </div>
    );
};

const PushContent: React.FC<{
  pushedFeatures: Set<string>;
  onTogglePushFeature: (featureId: string) => void;
}> = ({ pushedFeatures, onTogglePushFeature }) => {
    // These are features that can be pushed to the client view
    const pushableFeatures = DEVELOPER_SIDEBAR_ITEMS.filter(item => 
        !['templates', 'text', 'images', 'shapes', 'planner', 'push', 'feature-analysis', 'checklist'].includes(item.id)
    ).map(item => ({
        id: item.id,
        name: item.label,
        description: `Enable the ${item.label} panel in Client mode.`
    }));

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-md font-semibold text-gray-200">Push Features to Client</h3>
            <p className="text-xs text-gray-400">Select developer features to make them available in the Client view sidebar.</p>
            <div className="space-y-3">
                {pushableFeatures.map(feature => (
                    <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                        <div>
                            <p className="font-semibold text-sm">{feature.name}</p>
                            <p className="text-xs text-gray-400">{feature.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={pushedFeatures.has(feature.id)}
                                onChange={() => onTogglePushFeature(feature.id)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-brand-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-4">
        <h3 className="text-md font-semibold text-gray-200 capitalize">{title.replace('-', ' ')}</h3>
        <p className="text-sm text-gray-500 mt-2">This feature is not yet implemented.</p>
    </div>
);


const ContentPanel: React.FC<ContentPanelProps> = ({ activeItem, onClose, onAddElement, pushedFeatures, onTogglePushFeature }) => {
    
    const renderContent = () => {
        switch (activeItem) {
            case 'text':
                return <TextContent onAddElement={onAddElement} />;
            case 'shapes':
                return <ShapesContent onAddElement={onAddElement} />;
            case 'planner':
                return <ContentPlanner />;
            case 'branding':
                return <BrandingContent />; // Render the restored component
            case 'feature-analysis':
                return <FeatureAnalysisContent />;
            case 'server':
                return <PlatformAuthTools />;
            case 'push':
                return <PushContent pushedFeatures={pushedFeatures} onTogglePushFeature={onTogglePushFeature} />;
            case 'templates':
            case 'images':
            case 'ai':
            case 'collaboration':
            case 'version-control':
            case 'integrations':
            case 'checklist':
                return <PlaceholderContent title={activeItem} />;
            default:
                return null;
        }
    };
    
    return (
        <aside className="w-96 bg-gray-900 border-r border-gray-700/50 flex flex-col flex-shrink-0 animate-slide-in-left z-10">
            <div className="flex items-center justify-between p-3 border-b border-gray-700/50 h-16 flex-shrink-0">
                <h2 className="text-lg font-semibold capitalize pl-2">{activeItem.replace('-', ' ')}</h2>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors">
                    <Icon name="x" className="w-5 h-5" />
                </button>
            </div>
            <div className="overflow-y-auto flex-1">
                {renderContent()}
            </div>
        </aside>
    );
};

export default ContentPanel;
