import { CalendarEvent } from '../types/event';
import { getHourSlots, formatTime, isSameDay } from '../utils/dateUtils';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function DayView({ currentDate, events, onTimeSlotClick, onEventClick }: DayViewProps) {
  const hours = getHourSlots();
  const today = new Date();
  const isToday = isSameDay(currentDate, today);

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, currentDate) && eventStart.getHours() === hour;
    });
  };

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startMinutes = start.getMinutes();
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);

    return {
      top: (startMinutes / 60) * 100,
      height: Math.max((duration / 60) * 100, 25),
    };
  };

  const allDayEvents = events.filter(
    event => event.allDay && isSameDay(new Date(event.start), currentDate)
  );

  return (
    <div className="flex-1 flex flex-col bg-white border border-gray-300 overflow-hidden">
      <div className="border-b border-gray-300 sticky top-0 bg-white z-10 p-4">
        <div className="flex items-center space-x-3">
          <div
            className={`text-5xl font-light inline-flex items-center justify-center w-16 h-16 rounded-full ${
              isToday ? 'bg-blue-600 text-white' : 'text-gray-900'
            }`}
          >
            {currentDate.getDate()}
          </div>
          <div>
            <div className="text-xs text-gray-600 uppercase">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
            <div className="text-lg text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {allDayEvents.length > 0 && (
          <div className="mt-4 space-y-1">
            {allDayEvents.map((event) => (
              <div
                key={event.id}
                className={`px-3 py-2 rounded cursor-pointer hover:opacity-80 ${
                  event.color || 'bg-blue-100 text-blue-800'
                }`}
                onClick={() => onEventClick(event)}
              >
                <div className="font-medium">{event.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2">
          <div className="border-r border-gray-200">
            {hours.map((hour, index) => (
              <div key={index} className="h-16 border-b border-gray-200 text-xs text-gray-600 pr-3 text-right pt-1">
                {hour}
              </div>
            ))}
          </div>

          <div className="relative">
            {hours.map((_, hourIndex) => {
              const hourEvents = getEventsForHour(hourIndex);

              return (
                <div
                  key={hourIndex}
                  className="h-16 border-b border-gray-200 hover:bg-gray-50 cursor-pointer relative"
                  onClick={() => onTimeSlotClick(currentDate, hourIndex)}
                >
                  {hourEvents.map((event) => {
                    const position = getEventPosition(event);
                    return (
                      <div
                        key={event.id}
                        className={`absolute left-0 right-0 mx-1 rounded px-2 py-1 text-sm overflow-hidden cursor-pointer hover:opacity-80 ${
                          event.color || 'bg-blue-500 text-white'
                        }`}
                        style={{
                          top: `${position.top}%`,
                          height: `${position.height}%`,
                          minHeight: '30px',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
