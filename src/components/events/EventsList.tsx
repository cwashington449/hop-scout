import type { Event } from '../../types/event';
import EventCard from './EventCard';

interface EventsListProps {
  events: Event[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function EventsList({ events, isLoading, error }: EventsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load events
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="text-center py-8 text-gray-600">
        No upcoming events scheduled
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}