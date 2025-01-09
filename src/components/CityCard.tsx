import React from 'react';
import { MapPin } from 'lucide-react';

interface CityCardProps {
  name: string;
  state: string;
  stateCode: string;
  image: string;
  onClick: () => void;
}

export default function CityCard({ name, state, stateCode, image, onClick }: CityCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl aspect-[4/3] shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
      <img
        src={image}
        alt={`${name}, ${stateCode}`}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex items-center text-white">
          <MapPin className="mr-2" size={20} />
          <div className="text-left">
            <span className="text-xl font-semibold block">{name}</span>
            <span className="text-sm text-white/80">{state}</span>
          </div>
        </div>
      </div>
    </button>
  );
}