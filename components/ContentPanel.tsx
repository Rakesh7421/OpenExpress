import React from 'react';
import { AppVersion, ElementType } from '../types';
import { AppConfig } from '../config/appConfig';
import BrandingContent from './Branding/BrandingContent';
import ContentPlanner from './Planner/ContentPlanner';
import FeatureAnalysisContent from './FeatureAnalysis/FeatureAnalysisContent';
import PlatformAuthTools from './Server/PlatformAuthTools';
import ConsoleContent from './Console/ConsoleContent';


interface ContentPanelProps {
  activeItem: string;
  onAddElement: (type: ElementType) => void;
  onPushFeature: (featureId: string) => void;
  version: AppVersion;
  pushedFeatures: Set<string>;
  appConfig: AppConfig;
  setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const TextContent: React.FC<{ onAddElement: (type: ElementType) => void }> = ({ onAddElement }) => (
    <div className="p-4">
        <h3 className="text-md font-semibold text-gray-200 mb-4">Add Text</h3>
        <button onClick={() => onAddElement(ElementType.TEXT)} className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left">
            <p className="text-lg font-bold">Heading</p>
            <p className="text-sm text-gray-400">Add a heading to your design</p>
        </button>
    </div>
);

const ShapesContent: React.FC<{ onAddElement: (type: ElementType) => void }> = ({ onAddElement }) => (
    <div className="p-4">
        <h3 className="text-md font-semibold text-gray-200 mb-4">Add Shape</h3>
        <button onClick={() => onAddElement(ElementType.SHAPE)} className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left">
            <p className="text-lg font-bold">Rectangle</p>
            <p className="text-sm text-gray-400">Add a rectangle to your design</p>
        </button>
    </div>
);

const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-4">
        <h3 className="text-md font-semibold text-gray-200 mb-4">{title}</h3>
        <p className="text-sm text-gray-500">This section is under construction.</p>
    </div>
);


const DeveloperFeature: React.FC<{
    featureId: string;
    title: string;
    description: string;
    version: AppVersion;
    isPushed: boolean;
    onPushFeature: (featureId: string) => void;
    children: React.ReactNode;
}> = ({ featureId, title, description, version, isPushed, onPushFeature, children }) => {
    if (version === AppVersion.CLIENT && !isPushed) {
        return null;
    }

    return (
        <div className="h-full flex flex-col">
            {version === AppVersion.DEVELOPER && (
                <div className="p-4 bg-gray-900/50 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h3 className="text-md font-semibold text-gray-200">{title}</h3>
                        <p className="text-xs text-gray-400">{description}</p>
                    </div>
                    <button
                        onClick={() => onPushFeature(featureId)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            isPushed
                                ? 'bg-red-600 hover:bg-red-500 text-white'
                                : 'bg-green-600 hover:bg-green-500 text-white'
                        }`}
                    >
                        {isPushed ? 'Remove from Client' : 'Push to Client'}
                    </button>
                </div>
            )}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

const ContentPanel: React.FC<ContentPanelProps> = ({ activeItem, onAddElement, onPushFeature, version, pushedFeatures, appConfig, setAppConfig }) => {
    const isPushed = (featureId: string) => pushedFeatures.has(featureId);

    switch (activeItem) {
        case 'planner':
            return (
                 <DeveloperFeature
                    featureId="planner"
                    title="Content Planner"
                    description="Schedule and manage social media posts."
                    version={version}
                    isPushed={isPushed('planner')}
                    onPushFeature={onPushFeature}
                >
                    <ContentPlanner appConfig={appConfig} setAppConfig={setAppConfig} />
                </DeveloperFeature>
            );
        case 'templates':
            return <PlaceholderContent title="Templates" />;
        case 'text':
            return <TextContent onAddElement={onAddElement} />;
        case 'images':
            return <PlaceholderContent title="Images" />;
        case 'shapes':
            return <ShapesContent onAddElement={onAddElement} />;
        case 'branding':
            return (
                <DeveloperFeature
                    featureId="branding"
                    title="Branding & API Configuration"
                    description="Manage brand assets and connect to third-party APIs."
                    version={version}
                    isPushed={isPushed('branding')}
                    onPushFeature={onPushFeature}
                >
                    <BrandingContent appConfig={appConfig} setAppConfig={setAppConfig} />
                </DeveloperFeature>
            );
        case 'feature-analysis':
             return (
                <DeveloperFeature
                    featureId="feature-analysis"
                    title="Feature Analysis"
                    description="Compare OpenExpress with industry standards and track development."
                    version={version}
                    isPushed={isPushed('feature-analysis')}
                    onPushFeature={onPushFeature}
                >
                    <FeatureAnalysisContent />
                </DeveloperFeature>
            );
        case 'server':
             return (
                <DeveloperFeature
                    featureId="server"
                    title="Server Tools"
                    description="Connect and manage platform authentication tokens for local testing."
                    version={version}
                    isPushed={isPushed('server')}
                    onPushFeature={onPushFeature}
                >
                    <PlatformAuthTools />
                </DeveloperFeature>
            );
        case 'console':
             return (
                <DeveloperFeature
                    featureId="console"
                    title="Developer Console"
                    description="View logs and debug information from the backend."
                    version={version}
                    isPushed={isPushed('console')}
                    onPushFeature={onPushFeature}
                >
                    <ConsoleContent />
                </DeveloperFeature>
            );
        default:
            return <div className="p-4">Select an item from the sidebar</div>;
    }
};

export default ContentPanel;
