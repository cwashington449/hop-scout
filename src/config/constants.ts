export const API_CONFIG = {
  BASE_URL: 'https://api.openbrewerydb.org/v1',
  ENDPOINTS: {
    BREWERIES: '/breweries',
    EVENTS: '/.netlify/functions/api/events/search'
  },
} as const;

export const EVENT_CONFIG = {
  CATEGORIES: {
    FOOD_DRINK: '110',
    BEER: '10002'
  },
  SEARCH: {
    KEYWORDS: 'brewery OR "beer tasting" OR "craft beer"',
    RADIUS: '40mi',
    PAGE_SIZE: 50
  }
} as const;