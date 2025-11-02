
import React from 'react';
import { ElementType, AppVersion } from '../types';
import ContentPlanner from './Planner/ContentPlanner';
import BrandingContent from './Branding/BrandingContent';
import FeatureAnalysisContent from './FeatureAnalysis/FeatureAnalysisContent';
import PlatformAuthTools from './Server/PlatformAuthTools';
import { Icon } from './common/Icon';
import { AppConfig } from '../config/appConfig';

interface ContentPanelProps {
  activeItem: string;
  onAddElement: (type: ElementType) => void;
  onPushFeature: (featureId: string) => void;
  version: AppVersion;
  pushedFeatures: Set<string>;
  appConfig: AppConfig;
  setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const TextPanel: React.FC<{onAddElement: (type: ElementType) => void}> = ({ onAddElement }) => (
    <div className='p-4 space-y-2'>
        <button onClick={() => onAddElement(ElementType.TEXT)} className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-left">Add Heading</button>
    </div>
);
const ShapesPanel: React.FC<{onAddElement: (type: ElementType) => void}> = ({ onAddElement }) => (
    <div className='p-4 space-y-2'>
        <button onClick={() => onAddElement(ElementType.SHAPE)} className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-left">Add Rectangle</button>
    </div>
);

const PushPanel: React.FC<{pushedFeatures: Set<string>, onPushFeature: (featureId: string) => void}> = ({ pushedFeatures, onPushFeature }) => {
    const featuresToPush = ['ai', 'branding', 'collaboration', 'version-control', 'integrations', 'feature-analysis', 'server', 'checklist'];

    return (
        <div className="p-4 space-y-3">
             <h3 className="text-md font-semibold text-gray-200">Push Features to Client</h3>
             <p className="text-xs text-gray-400">Select features to make them available in the Client version of the app.</p>
             <div className="space-y-2">
                {featuresToPush.map(featureId => (
                    <label key={featureId} className="flex items-center gap-3 p-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700">
                        <input 
                            type="checkbox" 
                            checked={pushedFeatures.has(featureId)}
                            onChange={() => onPushFeature(featureId)}
                            className="w-4 h-4 rounded accent-brand-500 bg-gray-900 border-gray-600"
                        />
                        <span className="capitalize text-sm">{featureId.replace('-', ' ')}</span>
                    </label>
                ))}
             </div>
        </div>
    )
};

const ContentPanel: React.FC<ContentPanelProps> = (props) => {
  const { activeItem, onAddElement, pushedFeatures, onPushFeature, appConfig, setAppConfig } = props;
  
  const isDesignView = ['templates', 'text', 'images', 'shapes'].includes(activeItem);
  
  const renderContent = () => {
    switch (activeItem) {
      case 'text':
        return <TextPanel onAddElement={onAddElement} />;
      case 'shapes':
        return <ShapesPanel onAddElement={onAddElement} />;
      case 'planner':
        return <ContentPlanner appConfig={appConfig} setAppConfig={setAppConfig} />;
      case 'branding':
        return <BrandingContent appConfig={appConfig} setAppConfig={setAppConfig} />;
      case 'feature-analysis':
        return <FeatureAnalysisContent />;
      case 'server':
        return <PlatformAuthTools />;
      case 'push':
        return <PushPanel pushedFeatures={pushedFeatures} onPushFeature={onPushFeature} />;
      default:
        return (
            <div className="p-4 text-center text-gray-500">
                <Icon name={activeItem} className="w-12 h-12 mx-auto mb-2" />
                <h3 className="font-semibold capitalize">{activeItem}</h3>
                <p className="text-xs">Panel not implemented.</p>
            </div>
        );
    }
  };

  const panelClass = isDesignView 
    ? "w-80 bg-gray-900 border-r border-gray-700/50 overflow-y-auto"
    : "w-full bg-gray-900 overflow-y-auto";

  return <aside className={panelClass}>{renderContent()}</aside>;
};

export default ContentPanel;
