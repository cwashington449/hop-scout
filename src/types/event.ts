import type { Database } from './database';

type DbEvent = Database['public']['Tables']['events']['Row'];

export interface Event {
  id: string;
  breweryId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  imageUrl?: string;
  status: DbEvent['status'];
  createdAt: Date;
  updatedAt: Date;
}