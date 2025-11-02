import { CalendarEvent } from '../types/event';
import { getMonthDays, DAYS_OF_WEEK, isSameDay, isSameMonth, formatTime } from '../utils/dateUtils';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function MonthView({ currentDate, events, onDateClick, onEventClick }: MonthViewProps) {
  const days = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.start), date));
  };

  return (
    <div className="flex-1 flex flex-col bg-white border border-gray-300">
      <div className="grid grid-cols-7 border-b border-gray-300">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: 'repeat(6, minmax(0, 1fr))' }}>
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={index}
              className={`border-r border-b border-gray-200 last:border-r-0 p-1 overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors ${
                !isCurrentMonth ? 'bg-gray-50' : ''
              }`}
              onClick={() => onDateClick(day)}
            >
              <div className="flex justify-center mb-1">
                <span
                  className={`text-sm w-7 h-7 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-blue-600 text-white font-semibold'
                      : isCurrentMonth
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>

              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${
                      event.color || 'bg-blue-100 text-blue-800'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    title={event.title}
                  >
                    {event.allDay ? event.title : `${formatTime(new Date(event.start))} ${event.title}`}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-600 px-1.5">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
