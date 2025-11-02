import { CalendarEvent } from '../types/event';

const API_URL = 'http://localhost:3000/api/events';

export const eventApi = {
  // Get all events
  async getAllEvents(): Promise<CalendarEvent[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    const data = await response.json();
    // Convert date strings back to Date objects
    return data.map((event: any) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  },

  // Create a new event
  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    const data = await response.json();
    return {
      ...data,
      start: new Date(data.start),
      end: new Date(data.end),
    };
  },

  // Update an existing event
  async updateEvent(id: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('Failed to update event');
    }
    const data = await response.json();
    return {
      ...data,
      start: new Date(data.start),
      end: new Date(data.end),
    };
  },

  // Delete an event
  async deleteEvent(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  },
};
