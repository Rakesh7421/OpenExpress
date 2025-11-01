
import React from 'react';
import { AppVersion } from '../../types';

interface ToggleSwitchProps {
  version: AppVersion;
  onVersionChange: (newVersion: AppVersion) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ version, onVersionChange }) => {
  const isDeveloper = version === AppVersion.DEVELOPER;

  return (
    <div className="flex items-center p-1 bg-gray-800 rounded-full border border-gray-700">
      <button
        onClick={() => onVersionChange(AppVersion.CLIENT)}
        className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
          !isDeveloper ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        Client
      </button>
      <button
        onClick={() => onVersionChange(AppVersion.DEVELOPER)}
        className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
          isDeveloper ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        Developer
      </button>
    </div>
  );
};
