import React, { useState, useCallback } from 'react';
import { AppVersion } from '../types';
import { getDesignSuggestions } from '../services/geminiService';
import { Icon } from './common/Icon';

interface RightPanelProps {
  version: AppVersion;
}

const AISuggestionsPanel: React.FC = () => {
    const [prompt, setPrompt] = useState<string>("A modern, minimalist design for a coffee shop's social media post");
    const [suggestions, setSuggestions] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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

const LayersPanel: React.FC = () => (
    <div className="p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Layers</h3>
        <div className="space-y-2">
            {['Header Text', 'Image', 'Background Shape'].map(layer => (
                <div key={layer} className="flex items-center justify-between p-2 bg-gray-800 rounded-md hover:bg-gray-700/50 cursor-pointer">
                    <span className="text-sm">{layer}</span>
                    <Icon name="eye" className="w-4 h-4 text-gray-400" />
                </div>
            ))}
        </div>
    </div>
);


const RightPanel: React.FC<RightPanelProps> = ({ version }) => {
  return (
    <aside className="w-80 bg-gray-900 border-l border-gray-700/50 flex flex-col overflow-y-auto">
      {version === AppVersion.DEVELOPER ? (
        <>
            <AISuggestionsPanel/>
            <div className="border-t border-gray-700/50 my-2"></div>
            <LayersPanel />
        </>
      ) : (
        <div className="p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Edit</h3>
          <div className="space-y-4">
            <div>
                <label className="text-sm text-gray-400">Background Color</label>
                <div className="flex items-center gap-2 mt-1">
                    <div className="w-8 h-8 rounded border-2 border-white bg-indigo-100"></div>
                    <span className="font-mono text-sm">#EBF4FF</span>
                </div>
            </div>
             <div>
                <label className="text-sm text-gray-400">Font</label>
                <select className="w-full mt-1 p-2 bg-gray-800 border border-gray-600 rounded-md">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Lato</option>
                </select>
            </div>
             <div>
                <label className="text-sm text-gray-400">Font Size</label>
                <input type="range" min="12" max="120" defaultValue="64" className="w-full mt-1"/>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default RightPanel;