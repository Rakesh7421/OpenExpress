import React, { useState, useEffect } from 'react';
import { Icon } from './common/Icon';
import { Account } from './ContentPlanner';

interface SchedulePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date;
    groupedAccounts: Record<string, Account[]>;
    isAccountsLoading: boolean;
    onSchedule: (
        selectedAccounts: Set<string>,
        baseContent: string,
        contentOverrides: Record<string, string>,
        dateTime: string
    ) => Promise<boolean>;
}

const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ isOpen, onClose, selectedDate, groupedAccounts, isAccountsLoading, onSchedule }) => {
    const [baseContent, setBaseContent] = useState('');
    const [contentOverrides, setContentOverrides] = useState<Record<string, string>>({});
    const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
    const [scheduledDateTime, setScheduledDateTime] = useState('');
    const [isScheduling, setIsScheduling] = useState(false);

    useEffect(() => {
        const date = new Date(selectedDate);
        date.setHours(9, 0, 0, 0); // Default to 9:00 AM
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        setScheduledDateTime(`${yyyy}-${mm}-${dd}T09:00`);
    }, [selectedDate]);

    const handleAccountToggle = (accountId: string) => {
        setSelectedAccounts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(accountId)) {
                newSet.delete(accountId);
                setContentOverrides(currentOverrides => {
                    const newOverrides = {...currentOverrides};
                    delete newOverrides[accountId];
                    return newOverrides;
                });
            } else {
                newSet.add(accountId);
            }
            return newSet;
        });
    };
    
    const handleBaseContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBaseContent(e.target.value);
    };

    const handleOverrideChange = (accountId: string, value: string) => {
        setContentOverrides(prev => ({...prev, [accountId]: value}));
    };

    const handleScheduleClick = async () => {
        setIsScheduling(true);
        const success = await onSchedule(selectedAccounts, baseContent, contentOverrides, scheduledDateTime);
        setIsScheduling(false);
        if (success) {
            onClose();
        }
    };

    const allAccountsFlat = Object.values(groupedAccounts).flat();
    const selectedAccountDetails = allAccountsFlat.filter(acc => selectedAccounts.has(acc.id));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full max-w-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Schedule a Post for {selectedDate.toLocaleDateString()}</h3>
                    <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white rounded-full hover:bg-gray-700"><Icon name="x" className="w-4 h-4" /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">1. Select Accounts</label>
                        <div className="p-2 bg-gray-900/50 rounded-md max-h-40 overflow-y-auto space-y-2">
                            {isAccountsLoading ? (
                                <div className="text-xs text-gray-400">Loading...</div>
                            ) : allAccountsFlat.length > 0 ? (
                                Object.entries(groupedAccounts).map(([brandName, accounts]) => (
                                    <div key={brandName}>
                                        <p className="text-xs font-bold text-gray-400 px-1">{brandName}</p>
                                        {accounts.map(account => (
                                            <div key={account.id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-700/50">
                                                <input type="checkbox" id={`modal-${account.id}`} checked={selectedAccounts.has(account.id)} onChange={() => handleAccountToggle(account.id)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-brand-600"/>
                                                <div className="flex items-center gap-2 flex-1">
                                                    <span className={`w-2 h-2 rounded-full ${account.connected ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                                                    <label htmlFor={`modal-${account.id}`} className="text-sm flex-1 cursor-pointer">{account.name} <span className="text-xs text-gray-500">({account.platform})</span></label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-center text-gray-500 p-4">No accounts found.</p>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">2. Compose Base Content</label>
                        <textarea rows={5} value={baseContent} onChange={handleBaseContentChange} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md" placeholder="Write your main post here..."/>
                    </div>
                    
                    {selectedAccounts.size > 0 && (
                        <details className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                            <summary className="text-sm font-semibold cursor-pointer">Customize for Each Platform (Optional)</summary>
                            <div className="mt-3 pt-3 border-t border-gray-700 space-y-3 max-h-48 overflow-y-auto">
                                {selectedAccountDetails.map(account => (
                                    <div key={account.id}>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">{account.name} ({account.platform})</label>
                                        <textarea 
                                            rows={3} 
                                            value={contentOverrides[account.id] ?? baseContent} 
                                            onChange={(e) => handleOverrideChange(account.id, e.target.value)}
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm font-mono" 
                                        />
                                    </div>
                                ))}
                            </div>
                        </details>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">3. Set Time</label>
                        <input type="datetime-local" value={scheduledDateTime} onChange={e => setScheduledDateTime(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md" />
                    </div>

                    <button onClick={handleScheduleClick} disabled={isScheduling} className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg disabled:bg-gray-500">
                        {isScheduling ? <Icon name="loader" className="w-5 h-5 animate-spin"/> : <Icon name="calendar" className="w-5 h-5"/>}
                        <span>{isScheduling ? 'Scheduling...' : 'Confirm & Schedule'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SchedulePostModal;