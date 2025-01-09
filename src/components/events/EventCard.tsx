import { Calendar, Clock } from 'lucide-react';
import type { Event } from '../../types/event';
import { formatDate, formatTime } from '../../utils/dateFormatters';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(event.startTime)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2" />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
        </div>

        {event.description && (
          <p className="mt-3 text-gray-600 line-clamp-2">{event.description}</p>
        )}
      </div>
    </div>
  );
}