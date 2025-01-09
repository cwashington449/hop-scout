import { API_CONFIG } from '../config/constants';
import type { BreweryResponse } from '../types/brewery';
import { handleBreweryRequest } from './breweryApi';

interface SearchQuery {
  city?: string;
  state?: string;
  postalCode?: string;
}

function isZipCode(input: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(input);
}

function parseSearchInput(input: string): SearchQuery {
  // Check if input is a zip code
  if (isZipCode(input)) {
    return { postalCode: input };
  }

  // Otherwise parse as city, state
  const parts = input.split(',').map(part => part.trim());
  return {
    city: parts[0],
    state: parts[1]
  };
}

export const getCitySuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  const searchQuery = parseSearchInput(query);
  const params: Record<string, string> = { per_page: '10' };

  // Handle zip code search
  if (searchQuery.postalCode) {
    params.by_postal = searchQuery.postalCode;
    const breweries = await handleBreweryRequest<BreweryResponse[]>(API_CONFIG.ENDPOINTS.BREWERIES, params);
    
    if (breweries.length === 0) return [];
    
    // For zip codes, return only one result with the first matching city
    const firstBrewery = breweries[0];
    return [`${firstBrewery.city}, ${firstBrewery.state} ${firstBrewery.postal_code.substring(0, 5)}`];
  }

  // Handle city/state search
  if (searchQuery.city) {
    params.by_city = searchQuery.city;
    if (searchQuery.state) {
      params.by_state = searchQuery.state;
    }

    const breweries = await handleBreweryRequest<BreweryResponse[]>(API_CONFIG.ENDPOINTS.BREWERIES, params);
    const cities = new Set(breweries.map(brewery => 
      `${brewery.city}, ${brewery.state}`
    ));
    
    return Array.from(cities);
  }

  return [];
};