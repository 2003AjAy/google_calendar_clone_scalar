import { useState, useEffect } from 'react';
import { X, Clock, AlignLeft, Trash2 } from 'lucide-react';
import { CalendarEvent } from '../types/event';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
  onDelete?: (id: string) => void;
  event?: CalendarEvent;
  initialDate?: Date;
  initialHour?: number;
}

const COLOR_OPTIONS = [
  { name: 'Blue', class: 'bg-blue-500 text-white' },
  { name: 'Red', class: 'bg-red-500 text-white' },
  { name: 'Green', class: 'bg-green-500 text-white' },
  { name: 'Yellow', class: 'bg-yellow-500 text-white' },
  { name: 'Purple', class: 'bg-purple-500 text-white' },
  { name: 'Pink', class: 'bg-pink-500 text-white' },
  { name: 'Orange', class: 'bg-orange-500 text-white' },
  { name: 'Teal', class: 'bg-teal-500 text-white' },
];

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
  initialHour,
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState('bg-blue-500 text-white');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      const start = new Date(event.start);
      const end = new Date(event.end);

      setStartDate(start.toISOString().split('T')[0]);
      setStartTime(start.toTimeString().slice(0, 5));
      setEndDate(end.toISOString().split('T')[0]);
      setEndTime(end.toTimeString().slice(0, 5));
      setDescription(event.description || '');
      setAllDay(event.allDay || false);
      setColor(event.color || 'bg-blue-500 text-white');
    } else if (initialDate) {
      const date = initialDate.toISOString().split('T')[0];
      setStartDate(date);
      setEndDate(date);

      if (initialHour !== undefined) {
        const startHour = initialHour.toString().padStart(2, '0');
        const endHour = ((initialHour + 1) % 24).toString().padStart(2, '0');
        setStartTime(`${startHour}:00`);
        setEndTime(`${endHour}:00`);
      } else {
        setStartTime('09:00');
        setEndTime('10:00');
      }
    } else {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      setStartDate(date);
      setEndDate(date);
      setStartTime('09:00');
      setEndTime('10:00');
    }
  }, [event, initialDate, initialHour]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(`${startDate}T${startTime || '00:00'}`);
    const end = new Date(`${endDate}T${endTime || '23:59'}`);

    const eventData: Omit<CalendarEvent, 'id'> | CalendarEvent = {
      ...(event?.id && { id: event.id }),
      title,
      start,
      end,
      description,
      allDay,
      color,
    };

    onSave(eventData);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setDescription('');
    setAllDay(false);
    setColor('bg-blue-500 text-white');
    onClose();
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <form onSubmit={handleSubmit}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">
              {event ? 'Edit Event' : 'Add Event'}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-4 space-y-5">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add title"
                required
                className="w-full text-2xl font-normal border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none pb-2"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {!allDay && (
                  <div>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-5" />
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {!allDay && (
                  <div>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-5" />
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">All day</span>
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <AlignLeft className="w-5 h-5 text-gray-400 mt-2" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description"
                rows={4}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="grid grid-cols-8 gap-2">
                {COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setColor(option.class)}
                    className={`w-10 h-10 rounded-full ${option.class} ${
                      color === option.class ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    title={option.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div>
              {event && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
