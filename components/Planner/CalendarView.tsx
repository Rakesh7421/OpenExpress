import React, { useState } from 'react';
import { Icon } from '../common/Icon';
import { Post } from '../../types';

interface CalendarViewProps {
    posts: Post[];
    onDayClick: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ posts, onDayClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const isSameDay = (d1: Date, d2: Date) => 
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    return (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-700">
                    <Icon name="chevron-left" className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-700">
                    <Icon name="chevron-right" className="w-5 h-5" />
                </button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-gray-400 font-semibold border-b border-gray-700 pb-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 grid-rows-6 flex-1 gap-1">
                {days.map(d => {
                    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                    const postsForDay = posts.filter(p => isSameDay(p.scheduledAt, d));
                    return (
                        <div 
                            key={d.toISOString()}
                            onClick={() => onDayClick(d)}
                            className={`p-2 border border-transparent rounded-md cursor-pointer transition-colors ${
                                isCurrentMonth ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-800/50 text-gray-500 hover:bg-gray-700'
                            }`}
                        >
                            <span className="font-semibold">{d.getDate()}</span>
                            <div className="mt-1 space-y-1 overflow-hidden">
                                {postsForDay.map(post => (
                                    <div key={post.id} className="text-xs bg-brand-500/30 text-brand-300 p-1 rounded flex items-center gap-1" title={post.content}>
                                        {post.mediaUrl && <Icon name="image" className="w-3 h-3 flex-shrink-0" />}
                                        <span className="truncate">{post.content}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;