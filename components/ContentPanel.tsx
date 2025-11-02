
import React from 'react';
import BrandingContent from './BrandingContent';
import FeatureAnalysisContent from './FeatureAnalysisContent';
import ContentPlanner from './ContentPlanner';
import PlatformAuthTools from './PlatformAuthTools';

const StandaloneAISuggestions: React.FC = () => {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">AI Tools</h2>
            <p className="text-gray-400">This section would contain advanced AI features, like content generation, image suggestions, and more.</p>
        </div>
    )
}

const ServerPanel: React.FC = () => (
    <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">Server & Integrations</h2>
        <p className="text-gray-400">Manage platform connections and server settings.</p>
        <PlatformAuthTools />
    </div>
)


const NotImplementedPanel: React.FC<{ name: string }> = ({ name }) => (
  <div className="w-full h-full flex items-center justify-center p-8 bg-gray-800">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-400">{name}</h2>
      <p className="mt-2 text-lg text-gray-500">This feature is not yet implemented.</p>
    </div>
  </div>
);


const ContentPanel: React.FC<{ activePanel: string }> = ({ activePanel }) => {
    const renderPanel = () => {
        switch (activePanel) {
            case 'ai':
                return <StandaloneAISuggestions />;
            case 'branding':
                return <BrandingContent />;
            case 'planner':
                return <ContentPlanner />;
            case 'feature-analysis':
                return <FeatureAnalysisContent />;
            case 'server':
                return <ServerPanel />;
            case 'checklist':
                return <NotImplementedPanel name="Deployment Checklist" />;
            case 'push':
                return <NotImplementedPanel name="Push to Client" />;
             case 'collaboration':
                return <NotImplementedPanel name="Collaboration Tools" />;
            case 'version-control':
                return <NotImplementedPanel name="Version Control" />;
            case 'integrations':
                return <NotImplementedPanel name="Integrations" />;
            default:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold">Content Panel</h2>
                        <p>Selected: {activePanel}</p>
                    </div>
                );
        }
    };

    return (
        <div className="w-full h-full bg-gray-800 overflow-y-auto">
            {renderPanel()}
        </div>
    );
};

export default ContentPanel;
