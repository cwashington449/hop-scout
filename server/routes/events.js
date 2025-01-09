import express from 'express';
import { searchEvents } from '../services/eventbrite.js';

export const eventsRouter = express.Router();

eventsRouter.get('/search', async (req, res, next) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    const events = await searchEvents(location);
    res.json(events);
  } catch (error) {
    next(error);
  }
});