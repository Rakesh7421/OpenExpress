import React from 'react';
import { ElementType } from '../types';
import ContentPlanner from './ContentPlanner';
import BrandingContent from './BrandingContent';
import FeatureAnalysisContent from './FeatureAnalysisContent';
import PlatformAuthTools from './PlatformAuthTools';

interface ContentPanelProps {
  activeTab: string | null;
  onAddElement: (type: ElementType) => void;
}

const TextContent: React.FC<{ onAddElement: (type: ElementType) => void }> = ({ onAddElement }) => (
    <div className="p-4 space-y-4">
        <h3 className="text-md font-semibold text-gray-200">Text</h3>
        <button 
            onClick={() => onAddElement(ElementType.TEXT)}
            className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
        >
            <p className="text-lg font-bold">Add a heading</p>
            <p className="text-sm text-gray-400">Click to add a new text box.</p>
        </button>
    </div>
);

const ShapesContent: React.FC<{ onAddElement: (type: ElementType) => void }> = ({ onAddElement }) => (
    <div className="p-4 space-y-4">
        <h3 className="text-md font-semibold text-gray-200">Shapes</h3>
         <button 
            onClick={() => onAddElement(ElementType.SHAPE)}
            className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-4 transition-colors"
        >
            <div className="w-12 h-12 bg-gray-500 rounded-md flex-shrink-0"></div>
            <p className="font-semibold">Rectangle</p>
        </button>
    </div>
);

const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-4">
        <h3 className="text-md font-semibold text-gray-200">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">This feature is not yet implemented.</p>
    </div>
);


const ContentPanel: React.FC<ContentPanelProps> = ({ activeTab, onAddElement }) => {
    const renderContent = () => {
        switch (activeTab) {
            case 'text':
                return <TextContent onAddElement={onAddElement} />;
            case 'shapes':
                return <ShapesContent onAddElement={onAddElement} />;
            case 'planner':
                return <ContentPlanner />;
            case 'branding':
                return <BrandingContent />;
            case 'feature-analysis':
                return <FeatureAnalysisContent />;
            case 'server':
                return <PlatformAuthTools />;
            case 'templates':
            case 'images':
            case 'collaboration':
            case 'version-control':
            case 'integrations':
            case 'checklist':
            case 'push':
            case 'ai': // AI Suggest is in RightPanel
                 return <PlaceholderContent title={activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : ''} />;
            default:
                return null;
        }
    };

    if (!activeTab) {
        return null;
    }

    return (
        <aside className="w-80 bg-gray-900 border-r border-gray-700/50 flex flex-col overflow-y-auto flex-shrink-0">
            {renderContent()}
        </aside>
    );
};

export default ContentPanel;
