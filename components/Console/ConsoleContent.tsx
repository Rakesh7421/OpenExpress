import React, { useState, useEffect } from 'react';
import { Icon } from '../common/Icon';

interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

// Simulate logs coming from a backend or service
const mockLogs: LogEntry[] = [
  { level: 'info', message: 'Server started on port 3001.', timestamp: new Date().toISOString() },
  { level: 'info', message: 'User "Tempo" authenticated with Meta.', timestamp: new Date(Date.now() - 5000).toISOString() },
  { level: 'warn', message: 'JWT for X platform is about to expire.', timestamp: new Date(Date.now() - 2000).toISOString() },
];


const ConsoleContent: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
    const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');

    useEffect(() => {
        // In a real app, this would be a WebSocket connection
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                 setLogs(prev => [...prev, { level: 'error', message: 'Failed to post to LinkedIn: API limit reached.', timestamp: new Date().toISOString() }]);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const filteredLogs = logs.filter(log => filter === 'all' || log.level === filter);

    const getLevelStyles = (level: 'info' | 'warn' | 'error') => {
        switch (level) {
            case 'info': return 'text-blue-400';
            case 'warn': return 'text-yellow-400';
            case 'error': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };
    
    return (
        <div className="h-full flex flex-col bg-gray-900 text-white font-mono">
            <div className="p-2 flex items-center justify-between border-b border-gray-700/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                     <h3 className="text-sm font-semibold text-gray-300">Backend Logs</h3>
                     <span className={`px-2 py-0.5 text-xs rounded-full ${
                        logs.some(l => l.level === 'error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                     }`}>
                         Live
                     </span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setFilter('all')} className={`px-2 py-1 text-xs rounded ${filter === 'all' ? 'bg-brand-500/20 text-brand-300' : 'hover:bg-gray-700'}`}>All</button>
                    <button onClick={() => setFilter('info')} className={`px-2 py-1 text-xs rounded ${filter === 'info' ? 'bg-brand-500/20 text-brand-300' : 'hover:bg-gray-700'}`}>Info</button>
                    <button onClick={() => setFilter('warn')} className={`px-2 py-1 text-xs rounded ${filter === 'warn' ? 'bg-brand-500/20 text-brand-300' : 'hover:bg-gray-700'}`}>Warnings</button>
                    <button onClick={() => setFilter('error')} className={`px-2 py-1 text-xs rounded ${filter === 'error' ? 'bg-brand-500/20 text-brand-300' : 'hover:bg-gray-700'}`}>Errors</button>
                    <div className="w-px h-5 bg-gray-700 mx-1"></div>
                    <button onClick={() => setLogs([])} className="p-1.5 hover:bg-gray-700 rounded text-gray-400" title="Clear logs">
                        <Icon name="x" className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 text-xs">
                {filteredLogs.map((log, index) => (
                    <div key={index} className="flex gap-4">
                        <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`font-bold w-12 flex-shrink-0 ${getLevelStyles(log.level)}`}>[{log.level.toUpperCase()}]</span>
                        <span className="flex-1 whitespace-pre-wrap">{log.message}</span>
                    </div>
                ))}
                {filteredLogs.length === 0 && <p className="text-gray-600">No logs to display.</p>}
            </div>
        </div>
    );
};

export default ConsoleContent;
