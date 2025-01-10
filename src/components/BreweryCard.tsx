import { Link } from 'react-router-dom';
import { MapPin, Globe, Phone, Beer } from 'lucide-react';
import type { Brewery } from '../types/brewery';
import { getBreweryImage } from '../utils/breweryImages';

interface BreweryCardProps {
  brewery: Brewery;
}

const formatAddress = (brewery: Brewery): string => 
  [brewery.address_1, brewery.city, brewery.state]
    .filter(Boolean)
    .join(', ');

export default function BreweryCard({ brewery }: BreweryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
      <div className="relative h-48">
        <img
          src={getBreweryImage(brewery.brewery_type)}
          alt={brewery.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
          {brewery.brewery_type}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{brewery.name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin size={18} className="mr-2" />
            <span>{formatAddress(brewery)}</span>
          </div>
          
          {brewery.phone && (
            <div className="flex items-center text-gray-600">
              <Phone size={18} className="mr-2" />
              <span>{brewery.phone}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-auto pt-4 justify-center">
          {brewery.website_url && (
            <a
              href={brewery.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1"
            >
              <Globe size={18} className="mr-2" />
              Visit Website
            </a>
          )}
          <Link
            to={`/brewery/${brewery.id}`}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
          >
            <Beer size={18} className="mr-2" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}