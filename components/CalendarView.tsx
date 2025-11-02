
import React from 'react';
import { ScheduledPost } from './ContentPlanner';
import { Icon } from './common/Icon';

interface CalendarViewProps {
  posts: ScheduledPost[];
  currentDate: Date;
  onSelectPost: (post: ScheduledPost) => void;
  onNavigate: (newDate: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ posts, currentDate, onSelectPost, onNavigate }) => {
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysInMonth = endOfMonth.getDate();

  const handlePrevMonth = () => {
    onNavigate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    onNavigate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = [];
  // Add blank days for the start of the month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="border-r border-b border-gray-700/50"></div>);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const postsForDay = posts.filter(p => {
      const postDate = new Date(p.scheduledAt);
      return postDate.getFullYear() === date.getFullYear() &&
             postDate.getMonth() === date.getMonth() &&
             postDate.getDate() === date.getDate();
    });
    
    const isToday = new Date().toDateString() === date.toDateString();

    days.push(
      <div key={day} className="border-r border-b border-gray-700/50 p-1.5 min-h-[100px] flex flex-col">
        <span className={`text-xs font-semibold ${isToday ? 'bg-brand-500 text-white rounded-full w-5 h-5 flex items-center justify-center' : 'text-gray-400'}`}>
            {day}
        </span>
        <div className="mt-1 space-y-1 overflow-y-auto">
            {postsForDay.map(post => (
                <div 
                    key={post.id} 
                    onClick={() => onSelectPost(post)}
                    className="p-1 bg-indigo-600/50 text-white rounded-md text-xs truncate cursor-pointer hover:bg-indigo-500"
                >
                    {post.content}
                </div>
            ))}
        </div>
      </div>
    );
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-700 flex-shrink-0">
        <button onClick={handlePrevMonth} className="p-1.5 text-gray-400 hover:text-white rounded-md transition-colors">
          <Icon name="chevron-left" />
        </button>
        <h3 className="font-semibold text-lg">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={handleNextMonth} className="p-1.5 text-gray-400 hover:text-white rounded-md transition-colors">
          <Icon name="chevron-right" />
        </button>
      </div>
      <div className="grid grid-cols-7 flex-shrink-0">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-bold text-gray-500 p-2 border-r border-b border-gray-700/50">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1 overflow-y-auto">
        {days}
      </div>
    </div>
  );
};

export default CalendarView;
