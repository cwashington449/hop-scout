import axios from 'axios';
import type { Brewery, BreweryResponse } from '../types/brewery';

import { API_CONFIG } from '../config/constants';

interface SearchQuery {
  city?: string;
  state?: string;
  postalCode?: string;
}

function isZipCode(input: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(input);
}

function parseSearchInput(input: string): SearchQuery {
  // Check if input is a zip code with optional city and state
  const zipMatch = input.match(/(\d{5}(-\d{4})?)/);
  if (zipMatch) {
    return { postalCode: zipMatch[1] };
  }

  // Otherwise parse as city, state
  const [city = '', state = ''] = input.split(',').map(part => part.trim());

  let formattedCity = city.toLowerCase();
  let formattedState = state.toLowerCase();

  // Handle "New York City" special case
  if (formattedCity === 'new york city') {
    formattedCity = 'new york';
  }

  return {
    city: formattedCity,
    state: formattedState
  };
}

function formatBreweryData(brewery: BreweryResponse): Brewery {
  return {
    id: brewery.id,
    name: brewery.name,
    brewery_type: brewery.brewery_type,
    address_1: brewery.address_1,
    city: brewery.city,
    state: brewery.state,
    postal_code: brewery.postal_code,
    country: brewery.country,
    phone: brewery.phone,
    website_url: brewery.website_url,
    longitude: brewery.longitude,
    latitude: brewery.latitude
  };
}

export async function handleBreweryRequest<T>(
  url: string,
  params?: Record<string, string>
): Promise<T> {
  try {
    const response = await axios.get<T>(`${API_CONFIG.BASE_URL}${url}`, { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Brewery API Error: ${error.response?.data?.message || error.message}`
      );
    }
    throw error;
  }
}

export const searchBreweries = async (location: string): Promise<Brewery[]> => {
  const searchQuery = parseSearchInput(location);
  
  const params: Record<string, string> = { per_page: '50' };

  if (searchQuery.postalCode) {
    params.by_postal = searchQuery.postalCode.substring(0, 5); // Use first 5 digits for search
  } else if (searchQuery.city && searchQuery.state) {
    params.by_city = searchQuery.city;
    params.by_state = searchQuery.state;
  }
  
  try {
    const breweries = await handleBreweryRequest<BreweryResponse[]>(
      API_CONFIG.ENDPOINTS.BREWERIES,
      params
    );
    
    return breweries
      .filter(brewery => !EXCLUDED_BREWERY_TYPES.includes(brewery.brewery_type))
      .map(formatBreweryData);
  } catch (error) {
    console.error('Error searching breweries:', error);
    return [];
  }
};

const EXCLUDED_BREWERY_TYPES = ['planning', 'contract'];

export const getBreweryById = async (id: string): Promise<Brewery> => {
  const brewery = await handleBreweryRequest<BreweryResponse>(
    `${API_CONFIG.ENDPOINTS.BREWERIES}/${id}`
  );
  
  if (!brewery) {
    throw new Error('Brewery not found');
  }
  
  return formatBreweryData(brewery);
};