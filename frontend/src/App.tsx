import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import EventModal from './components/EventModal';
import { CalendarEvent } from './types/event';
import { MONTHS } from './utils/dateUtils';
import { eventApi } from './services/api';

type ViewType = 'month' | 'week' | 'day';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>();
  const [modalInitialHour, setModalInitialHour] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  // Fetch events from database on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await eventApi.getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to load events. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getDateRangeText = () => {
    if (view === 'month') {
      return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startMonth = MONTHS[startOfWeek.getMonth()];
      const endMonth = MONTHS[endOfWeek.getMonth()];
      const year = currentDate.getFullYear();

      if (startMonth === endMonth) {
        return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${year}`;
      }
      return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${year}`;
    } else {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setModalInitialDate(undefined);
    setModalInitialHour(undefined);
    setIsModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setModalInitialDate(date);
    setModalInitialHour(undefined);
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    setModalInitialDate(date);
    setModalInitialHour(hour);
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalInitialDate(undefined);
    setModalInitialHour(undefined);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id'> | CalendarEvent) => {
    try {
      if ('id' in eventData && eventData.id) {
        // Update existing event
        const updatedEvent = await eventApi.updateEvent(eventData.id, eventData);
        setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
      } else {
        // Create new event
        const newEvent = await eventApi.createEvent(eventData);
        setEvents([...events, newEvent]);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventApi.deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="border-b border-gray-300 bg-white">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-6 h-6 text-gray-700" />
              <h1 className="text-xl text-gray-700 font-normal">Calendar</h1>
            </div>

            <button
              onClick={handleToday}
              className="px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded border border-gray-300 transition-colors"
            >
              Today
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevious}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl text-gray-700 font-normal">{getDateRangeText()}</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-white border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setView('day')}
                className={`px-4 py-2 text-sm transition-colors ${
                  view === 'day'
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 text-sm border-l border-r border-gray-300 transition-colors ${
                  view === 'week'
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 text-sm transition-colors ${
                  view === 'month'
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
            </div>

            <button
              onClick={handleCreateEvent}
              className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading events...</div>
          </div>
        ) : (
          <>
            {view === 'month' && (
              <MonthView
                currentDate={currentDate}
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
              />
            )}
            {view === 'week' && (
              <WeekView
                currentDate={currentDate}
                events={events}
                onTimeSlotClick={handleTimeSlotClick}
                onEventClick={handleEventClick}
              />
            )}
            {view === 'day' && (
              <DayView
                currentDate={currentDate}
                events={events}
                onTimeSlotClick={handleTimeSlotClick}
                onEventClick={handleEventClick}
              />
            )}
          </>
        )}
      </main>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        initialDate={modalInitialDate}
        initialHour={modalInitialHour}
      />
    </div>
  );
}

export default App;
