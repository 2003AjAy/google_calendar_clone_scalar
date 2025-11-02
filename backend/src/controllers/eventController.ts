import { Request, Response } from 'express';
import { db } from '../db/connection';
import { events } from '../db/schema';
import { eq } from 'drizzle-orm';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const allEvents = await db.select().from(events);
    res.json(allEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await db.select().from(events).where(eq(events.id, id));
    
    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, start, end, description, color, allDay } = req.body;
    
    if (!title || !start || !end) {
      return res.status(400).json({ error: 'Title, start, and end are required' });
    }
    
    const newEvent = await db.insert(events).values({
      title,
      start: new Date(start),
      end: new Date(end),
      description,
      color: color || 'bg-blue-500 text-white',
      allDay: allDay || false,
    }).returning();
    
    res.status(201).json(newEvent[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, start, end, description, color, allDay } = req.body;
    
    const updatedEvent = await db.update(events)
      .set({
        title,
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
        description,
        color,
        allDay,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();
    
    if (updatedEvent.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(updatedEvent[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deletedEvent = await db.delete(events)
      .where(eq(events.id, id))
      .returning();
    
    if (deletedEvent.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully', event: deletedEvent[0] });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
