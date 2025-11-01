import React, { useState, useMemo } from 'react';
import { AppVersion } from '../types';
import { Icon } from './common/Icon';

interface ContentPlannerProps {
  version: AppVersion;
}

// Mock data
const brands = ['Nike', 'Adidas', 'Puma'];
const platforms = ['Facebook', 'Instagram', 'X', 'LinkedIn', 'TikTok'];
const stages = ['live', 'dev'];
const credentialTypes = ['app', 'token'];
const tokenTypes = ['page_access', 'user_access', 'group_access'];

const StyledSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }> = ({ label, id, options, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">
      {label}
    </label>
    <select
      id={id}
      className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
      {...props}
    >
      <option value="">Select {label}...</option>
      {options.map(option => (
        <option key={option} value={option.toLowerCase().replace(' ', '_')}>{option}</option>
      ))}
    </select>
  </div>
);

const ContentPlanner: React.FC<ContentPlannerProps> = ({ version }) => {
  // Developer state
  const [devBrand, setDevBrand] = useState('');
  const [devPlatform, setDevPlatform] = useState('');
  const [devStage, setDevStage] = useState('');
  const [devCredential, setDevCredential] = useState('');
  const [devToken, setDevToken] = useState('');

  // Client state
  const [clientBrand, setClientBrand] = useState('');
  const [clientPlatform, setClientPlatform] = useState('');
  
  // Shared state
  const [postContent, setPostContent] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  
  const handleSchedule = () => {
      setIsScheduling(true);
      setIsScheduled(false);
      setTimeout(() => {
          setIsScheduling(false);
          setIsScheduled(true);
          setTimeout(() => setIsScheduled(false), 3000); // Hide message after 3s
      }, 1500);
  }

  const developerSelection = useMemo(() => {
      if (!devBrand || !devPlatform || !devStage || !devCredential) return null;
      let result = `${devBrand}_${devPlatform}_${devStage}`;
      if (devCredential === 'app') {
          return `${result}_app_id/secret`;
      }
      if (devCredential === 'token' && devToken) {
          return `${result}_${devToken}`;
      }
      return null;
  }, [devBrand, devPlatform, devStage, devCredential, devToken]);

  const clientSelection = useMemo(() => {
      if (!clientBrand || !clientPlatform) return null;
      return `${clientBrand}_${clientPlatform}_app_id/secret`;
  }, [clientBrand, clientPlatform]);


  const renderDeveloperPanel = () => (
    <div className="p-4 space-y-4">
       <h3 className="text-md font-semibold text-gray-200 mb-1">Developer Configuration</h3>
       <p className="text-sm text-gray-400 mb-4">Construct the precise environment variable for your post.</p>
       <div className="space-y-3">
         <StyledSelect label="Brand" id="dev-brand" options={brands} value={devBrand} onChange={e => setDevBrand(e.target.value)} />
         <StyledSelect label="Platform" id="dev-platform" options={platforms} value={devPlatform} onChange={e => setDevPlatform(e.target.value)} />
         <StyledSelect label="Stage" id="dev-stage" options={stages} value={devStage} onChange={e => setDevStage(e.target.value)} />
         <StyledSelect label="Credential Type" id="dev-credential" options={credentialTypes} value={devCredential} onChange={e => { setDevCredential(e.target.value); setDevToken(''); }} />
         {devCredential === 'token' && (
            <StyledSelect label="Token Type" id="dev-token" options={tokenTypes} value={devToken} onChange={e => setDevToken(e.target.value)} />
         )}
       </div>
       
       {developerSelection && (
         <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <h4 className="text-sm font-semibold text-gray-300 mb-1">Resulting Variable</h4>
            <p className="font-mono text-xs text-brand-400 break-all">{developerSelection}</p>
         </div>
       )}
    </div>
  );

  const renderClientPanel = () => (
     <div className="p-4 space-y-4">
       <h3 className="text-md font-semibold text-gray-200 mb-1">Plan Your Content</h3>
       <p className="text-sm text-gray-400 mb-4">Select the brand and platform for your new post.</p>
       <div className="space-y-3">
         <StyledSelect label="Brand" id="client-brand" options={brands} value={clientBrand} onChange={e => setClientBrand(e.target.value)} />
         <StyledSelect label="Platform" id="client-platform" options={platforms} value={clientPlatform} onChange={e => setClientPlatform(e.target.value)} />
       </div>
        {clientSelection && (
         <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center gap-3">
            <Icon name="check-circle" className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div>
                <h4 className="text-sm font-semibold text-gray-300">Credentials Selected</h4>
                <p className="text-xs text-gray-400">Using credentials for: <span className="font-medium text-gray-300">{clientBrand.charAt(0).toUpperCase() + clientBrand.slice(1)} on {clientPlatform.charAt(0).toUpperCase() + clientPlatform.slice(1)}</span></p>
            </div>
         </div>
       )}
    </div>
  );

  const canSchedule = postContent.trim().length > 0 && (!!developerSelection || !!clientSelection);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {version === AppVersion.DEVELOPER ? renderDeveloperPanel() : renderClientPanel()}
        
        {/* Shared Content Area */}
        <div className="p-4">
            <label htmlFor="post-content" className="block text-sm font-medium text-gray-400 mb-1">
                Post Content
            </label>
            <textarea
                id="post-content"
                rows={8}
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                placeholder="What do you want to share?"
            />
        </div>
      </div>
      
      {/* Shared Footer/Action Area */}
      <div className="p-4 border-t border-gray-700/50 mt-auto flex-shrink-0">
         {isScheduled && (
            <div className="mb-3 p-2 text-center text-sm bg-green-900/50 text-green-300 rounded-md">
                Post scheduled successfully!
            </div>
        )}
        <button
            onClick={handleSchedule}
            disabled={!canSchedule || isScheduling}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
            {isScheduling ? (
                <Icon name="loader" className="w-5 h-5 animate-spin" />
            ) : (
                <Icon name="calendar" className="w-5 h-5" />
            )}
            <span>{isScheduling ? 'Scheduling...' : 'Schedule Post'}</span>
        </button>
      </div>
    </div>
  );
};

export default ContentPlanner;
