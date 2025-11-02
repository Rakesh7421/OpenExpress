import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Icon } from '../common/Icon';

const initialMarkdownContent = `# Feature Comparison: OpenExpress vs. Adobe Express Content Planner

This document compares the content scheduling and posting features of the current OpenExpress application with a mature product like Adobe Express. The goal is to identify key gaps and define a roadmap for feature parity.

## Core Posting Workflow Comparison

| Feature                    | Adobe Express (Industry Standard)                                      | OpenExpress (Current)                                      | Proposed OpenExpress Improvement                                                              |
| -------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Account Selection**      | ✅ Supports selecting multiple accounts/pages simultaneously (e.g., 2 Facebook pages, 1 Instagram). | ❌ Only allows selecting a single brand and platform via dropdowns. | - [ ] **Implement multi-platform selection UI.** Allow users to select multiple target platforms via checkboxes. |
| **Simultaneous Posting**   | ✅ Core feature. A single piece of content can be scheduled to all selected accounts in one action. | ❌ One post must be scheduled for each platform individually. | - [ ] **Enable one-to-many scheduling.** A single click on "Schedule Post" should send the content to all selected platforms. |
| **Platform Customization** | ✅ Allows users to slightly tweak the post content (e.g., add different hashtags) for each selected platform before publishing. | ❌ The same content is used for the single selected platform. | - [ ] (Future) After implementing multi-post, add a feature to customize content for each destination. |
| **Scheduling Interface**   | ✅ Typically provides a full calendar view to drag-and-drop posts and visualize the content schedule over time. | ✅ Simple form-based scheduling for immediate posting. | - [ ] (Future) Develop a visual calendar component to replace the simple form for a more intuitive planning experience. |

## Action Plan

Based on this comparison, the immediate priority is to implement the foundational multi-platform posting capability.

- [x] **Update the UI**: Replace the single "Platform" dropdown with a multi-select component (e.g., checkboxes).
- [x] **Enhance Scheduling Logic**: Modify the \`handleSchedule\` function to iterate through all selected platforms and dispatch a separate scheduling request for each one.
- [x] **Improve User Feedback**: Provide a summary of the scheduling results, indicating which platforms succeeded and which failed.
`;

const FeatureAnalysisContent: React.FC = () => {
    const [markdownContent, setMarkdownContent] = useState(initialMarkdownContent);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const saveMarkdownToServer = useCallback(async (content: string) => {
        setSaveStatus('saving');
        const token = ['meta', 'x', 'linkedin', 'tiktok'].reduce<string | null>((foundToken, id) => {
            if (foundToken) return foundToken;
            return localStorage.getItem(`${id}_jwt`);
        }, null);

        if (!token) {
            setSaveStatus('error');
            console.error("No auth token found. Cannot save changes.");
            return;
        }

        try {
            const response = await fetch('/api/feature-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save.');
            }
            setSaveStatus('success');
        } catch (error) {
            console.error("Error saving feature analysis:", error);
            setSaveStatus('error');
        } finally {
            setTimeout(() => setSaveStatus('idle'), 2000);
        }
    }, []);

    const handleToggleCheckbox = (lineIndex: number) => {
        const lines = markdownContent.split('\n');
        const line = lines[lineIndex];
        let newLine = line;

        if (line.includes('- [ ]')) {
            newLine = line.replace('- [ ]', '- [x]');
        } else if (line.includes('- [x]')) {
            newLine = line.replace('- [x]', '- [ ]');
        } else {
            return; // Not a toggleable line
        }

        lines[lineIndex] = newLine;
        const newContent = lines.join('\n');
        setMarkdownContent(newContent);
        saveMarkdownToServer(newContent);
    };

    const renderMarkdown = () => {
        const lines = markdownContent.split('\n');
        let inTable = false;
        const table: { headers: string[], rows: string[][] } = { headers: [], rows: [] };

        const renderTable = () => {
            if (table.rows.length === 0) return null;
            return (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-gray-800">
                                {table.headers.map((header, i) => <th key={i} className="p-2 border border-gray-600 text-left font-semibold">{header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {table.rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="bg-gray-800/50 border-t border-gray-700">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="p-2 border border-gray-700 align-top" dangerouslySetInnerHTML={{ __html: parseCellContent(cell, lines.indexOf(lines.find(l => l.includes(cell)) || '')) }}></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        };

        const parseCellContent = (cellContent: string, lineIndex: number) => {
            return cellContent.replace(/- \[( |x)\]/g, (match, checked) => {
                 const isChecked = checked === 'x';
                 return `<input type="checkbox" ${isChecked ? 'checked' : ''} class="task-checkbox" data-line-index="${lineIndex}" />`;
            }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code class="text-xs bg-gray-700 p-1 rounded font-mono">$1</code>');
        };
        

        const elements = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('# ')) {
                elements.push(<h1 key={i} className="text-2xl font-bold mt-6 mb-3 pb-2 border-b border-gray-700">{line.substring(2)}</h1>);
            } else if (line.startsWith('## ')) {
                elements.push(<h2 key={i} className="text-xl font-semibold mt-4 mb-2">{line.substring(3)}</h2>);
            } else if (line.startsWith('|')) {
                const cells = line.split('|').map(c => c.trim()).slice(1, -1);
                if (line.includes('---')) { // Header separator
                    table.headers = table.rows.pop() || [];
                } else {
                    table.rows.push(cells);
                }
                if (!inTable) inTable = true;
            } else {
                if (inTable) {
                    elements.push(<div key={`table-${i}`}>{renderTable()}</div>);
                    table.headers = []; table.rows = [];
                    inTable = false;
                }
                
                if (line.trim().startsWith('- [')) {
                    const isChecked = line.includes('- [x]');
                    elements.push(
                        <div key={i} className="flex items-center gap-2 my-1">
                            <input type="checkbox" checked={isChecked} onChange={() => handleToggleCheckbox(i)} className="task-checkbox" />
                            <span className={isChecked ? 'line-through text-gray-500' : ''} dangerouslySetInnerHTML={{__html: line.replace(/- \[( |x)\]/, '')}}/>
                        </div>
                    );
                } else if (line.trim()) {
                    elements.push(<p key={i} className="text-gray-400 my-2">{line}</p>);
                }
            }
        }
        if (inTable) elements.push(<div key="last-table">{renderTable()}</div>);

        return elements;
    };
    
    // Add event listener to handle clicks on dynamically generated checkboxes inside the table
    useEffect(() => {
        const listener = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.matches('.task-checkbox[data-line-index]')) {
                const lineIndex = parseInt(target.getAttribute('data-line-index')!, 10);
                if (!isNaN(lineIndex)) {
                    handleToggleCheckbox(lineIndex);
                }
            }
        };
        document.addEventListener('change', listener);
        return () => document.removeEventListener('change', listener);
    }, [markdownContent]);

    const getStatusIndicator = () => {
        switch (saveStatus) {
            case 'saving': return <div className="flex items-center gap-2 text-yellow-400"><Icon name="loader" className="w-4 h-4 animate-spin" /><span>Saving...</span></div>;
            case 'success': return <div className="flex items-center gap-2 text-green-400"><Icon name="check-circle" className="w-4 h-4" /><span>Saved!</span></div>;
            case 'error': return <div className="flex items-center gap-2 text-red-400"><Icon name="x" className="w-4 h-4" /><span>Save Failed</span></div>;
            default: return null;
        }
    };

    return (
        <div className="p-4">
            <style>{`
                .task-checkbox {
                    width: 1rem;
                    height: 1rem;
                    cursor: pointer;
                    accent-color: #0ea5e9;
                }
            `}</style>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-200">Content Planner Feature Analysis</h3>
                <div className="text-xs font-semibold h-6">{getStatusIndicator()}</div>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
                {renderMarkdown()}
            </div>
        </div>
    );
};

export default FeatureAnalysisContent;