import { CalendarEvent } from '../types/event';
import { getWeekDays, DAYS_OF_WEEK, isSameDay, getHourSlots, formatTime } from '../utils/dateUtils';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function WeekView({ currentDate, events, onTimeSlotClick, onEventClick }: WeekViewProps) {
  const weekDays = getWeekDays(currentDate);
  const hours = getHourSlots();
  const today = new Date();

  const getEventsForDayAndHour = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, date) && eventStart.getHours() === hour;
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

  return (
    <div className="flex-1 flex flex-col bg-white border border-gray-300 overflow-hidden">
      <div className="grid grid-cols-8 border-b border-gray-300 sticky top-0 bg-white z-10">
        <div className="py-3 border-r border-gray-200"></div>
        {weekDays.map((day, index) => {
          const isToday = isSameDay(day, today);
          return (
            <div key={index} className="py-3 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-xs text-gray-600">{DAYS_OF_WEEK[day.getDay()]}</div>
              <div
                className={`text-2xl font-light mt-1 inline-flex items-center justify-center w-10 h-10 rounded-full ${
                  isToday ? 'bg-blue-600 text-white' : 'text-gray-900'
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8">
          <div className="border-r border-gray-200">
            {hours.map((hour, index) => (
              <div key={index} className="h-16 border-b border-gray-200 text-xs text-gray-600 pr-2 text-right pt-1">
                {hour}
              </div>
            ))}
          </div>

          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r border-gray-200 last:border-r-0 relative">
              {hours.map((_, hourIndex) => {
                const dayEvents = getEventsForDayAndHour(day, hourIndex);

                return (
                  <div
                    key={hourIndex}
                    className="h-16 border-b border-gray-200 hover:bg-gray-50 cursor-pointer relative"
                    onClick={() => onTimeSlotClick(day, hourIndex)}
                  >
                    {dayEvents.map((event) => {
                      const position = getEventPosition(event);
                      return (
                        <div
                          key={event.id}
                          className={`absolute left-0 right-0 mx-0.5 rounded px-1.5 py-0.5 text-xs overflow-hidden cursor-pointer hover:opacity-80 ${
                            event.color || 'bg-blue-500 text-white'
                          }`}
                          style={{
                            top: `${position.top}%`,
                            height: `${position.height}%`,
                            minHeight: '25px',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-xs opacity-90">
                            {formatTime(new Date(event.start))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
