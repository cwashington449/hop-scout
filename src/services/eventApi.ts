import { supabase } from './supabaseClient';
import type { Event } from '../types/event';
import type { Database } from '../types/database';

type DbEvent = Database['public']['Tables']['events']['Row'];

export async function getBreweryEvents(breweryId: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('brewery_id', breweryId)
    .eq('status', 'published')
    .gte('end_time', new Date().toISOString())
    .order('start_time', { ascending: true });

  if (error) throw error;

  // Transform database events to application events
  return data.map((dbEvent: DbEvent): Event => ({
    id: dbEvent.id,
    breweryId: dbEvent.brewery_id,
    title: dbEvent.title,
    description: dbEvent.description || undefined,
    startTime: new Date(dbEvent.start_time),
    endTime: new Date(dbEvent.end_time),
    imageUrl: dbEvent.image_url || undefined,
    status: dbEvent.status,
    createdAt: new Date(dbEvent.created_at),
    updatedAt: new Date(dbEvent.updated_at)
  }));
}