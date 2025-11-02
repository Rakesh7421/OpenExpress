import React, { useState } from 'react';
import { Icon } from './common/Icon';
import { ScheduledPost } from './ContentPlanner';

interface CalendarViewProps {
    posts: ScheduledPost[];
    onSelectDate: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ posts, onSelectDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const days = [];
    // Previous month's padding
    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`prev-${i}`} className="p-2 border border-gray-800 bg-gray-900/50 text-gray-600"></div>);
    }
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const postsForDay = posts.filter(p => p.scheduledAt.toDateString() === date.toDateString());

        days.push(
            <div 
                key={i} 
                className="p-2 border border-gray-700/80 bg-gray-800 hover:bg-gray-700/50 cursor-pointer flex flex-col min-h-[100px]"
                onClick={() => onSelectDate(date)}
            >
                <span className="font-semibold">{i}</span>
                <div className="mt-1 space-y-1 overflow-y-auto">
                    {postsForDay.map(post => (
                        <div key={post.id} className="p-1 bg-brand-900/70 rounded-md text-xs truncate" title={post.content}>
                            {post.content}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const today = () => setCurrentDate(new Date());

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                <div className="flex items-center gap-2">
                    <button onClick={today} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md">Today</button>
                    <button onClick={prevMonth} className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md"><Icon name="chevron-left" className="w-4 h-4" /></button>
                    <button onClick={nextMonth} className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md"><Icon name="chevron-right" className="w-4 h-4" /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 text-xs text-center font-bold text-gray-400 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 flex-1 text-sm">
                {days}
            </div>
        </div>
    );
};

export default CalendarView;