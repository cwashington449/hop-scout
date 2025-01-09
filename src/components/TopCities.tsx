import React from 'react';
import { POPULAR_CITIES } from '../data/popularCities';
import CityCard from './CityCard';

interface TopCitiesProps {
  onCitySelect: (cityAndState: string) => void;
}

export default function TopCities({ onCitySelect }: TopCitiesProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Beer Cities</h2>
        <p className="text-gray-600 mb-8">Explore thriving craft beer scenes and upcoming brewery events</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_CITIES.map((city) => (
            <CityCard
              key={`${city.name}-${city.stateCode}`}
              {...city}
              onClick={() => onCitySelect(`${city.name}, ${city.state}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}