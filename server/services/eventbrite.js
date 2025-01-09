import axios from 'axios';

const EVENTBRITE_CONFIG = {
  BASE_URL: 'https://www.eventbriteapi.com/v3',
  CATEGORIES: {
    FOOD_DRINK: '110',
    BEER: '10002',
  },
  SEARCH_KEYWORDS: 'brewery OR "beer tasting" OR "craft beer"',
  SEARCH_RADIUS: '40mi',
  PAGE_SIZE: 50,
};

const eventbriteClient = axios.create({
  baseURL: EVENTBRITE_CONFIG.BASE_URL,
  headers: {
    'Authorization': `Bearer ${process.env.EVENTBRITE_PRIVATE_TOKEN}`, // Use private token instead of API key
    'Accept': 'application/json',
  },
  timeout: 15000,
});

export async function searchEvents(location) {
  try {
    const response = await eventbriteClient.get('/events/search', {
      params: {
        q: EVENTBRITE_CONFIG.SEARCH_KEYWORDS,
        'location.address': location,
        'location.within': EVENTBRITE_CONFIG.SEARCH_RADIUS,
        categories: EVENTBRITE_CONFIG.CATEGORIES.FOOD_DRINK,
        subcategories: EVENTBRITE_CONFIG.CATEGORIES.BEER,
        'start_date.range_start': new Date().toISOString(),
        expand: 'venue,ticket_availability',
        page_size: EVENTBRITE_CONFIG.PAGE_SIZE,
        status: 'live',
      }
    });

    if (!response.data?.events) {
      console.log('No events found in response:', response.data);
      return [];
    }

    return response.data.events;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Eventbrite API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    } else {
      console.error('Network Error:', error.message);
    }
    throw error;
  }
}