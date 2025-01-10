import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Globe, Phone } from 'lucide-react';
import type { Brewery } from '../types/brewery';
import { useBreweryEvents } from '../hooks/useBreweryEvents';
import EventsList from '../components/events/EventsList';
import { getBreweryById } from '../services/breweryApi';
import Header from '../components/Header';
import { getBreweryImage } from '../utils/breweryImages';
import { useNavigate } from 'react-router-dom';

const LOADING_STATE = (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
  </div>
);

const ERROR_STATE = (
  <div className="text-center py-12">
    <p className="text-red-600">Error loading brewery details.</p>
    <Link to="/" className="text-green-600 hover:text-green-700 mt-4 inline-block">
      Return to home
    </Link>
  </div>
);

export default function BreweryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    data: brewery, 
    isLoading: isLoadingBrewery, 
    isError: isBreweryError 
  } = useQuery<Brewery>({
    queryKey: ['brewery', id],
    queryFn: () => getBreweryById(id!),
    enabled: !!id,
  });

  const {
    data: events,
    isLoading: isLoadingEvents,
    error: eventsError
  } = useBreweryEvents(id!);

  if (isLoadingBrewery) return LOADING_STATE;
  if (isBreweryError || !brewery) return ERROR_STATE;

  const address = [brewery.address_1, brewery.city, brewery.state, brewery.postal_code]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onReset={() => navigate('/')} 
        onSearch={(city) => navigate(`/?city=${encodeURIComponent(city)}`)} 
      />
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={getBreweryImage(brewery.brewery_type)}
              alt={brewery.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h1 className="text-4xl font-bold text-white">{brewery.name}</h1>
              <div className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium mt-2">
                {brewery.brewery_type}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Location & Contact</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="text-green-600 mr-3" size={24} />
                    <span>{address}
                    </span>
                  </div>
                  
                  {brewery.phone && (
                    <div className="flex items-center">
                      <Phone className="text-green-600 mr-3" size={24} />
                      <span>{brewery.phone}</span>
                    </div>
                  )}

                  {brewery.website_url && (
                    <div className="flex items-center">
                      <Globe className="text-green-600 mr-3" size={24} />
                      <a 
                        href={brewery.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {(brewery.latitude && brewery.longitude) && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Map</h2>
                  <div className="h-64 bg-gray-100 rounded-lg">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${brewery.latitude},${brewery.longitude}`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
              <EventsList
                events={events || []}
                isLoading={isLoadingEvents}
                error={eventsError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}