// Response type from the OpenBreweryDB API
export interface BreweryResponse {
  id: string;
  name: string;
  brewery_type: string;
  address_1: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  website_url: string | null;
  longitude: string | null;
  latitude: string | null;
}

// Application's internal brewery type
export interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  address_1?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  website_url?: string;
  longitude?: string;
  latitude?: string;
}

export type SortField = 'name' | 'brewery_type';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}