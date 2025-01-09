import React from 'react';
import { MapPin } from 'lucide-react';

interface SuggestionsProps {
  suggestions: string[];
  onSelect: (city: string) => void;
  visible: boolean;
}

export default function Suggestions({ suggestions, onSelect, visible }: SuggestionsProps) {
  if (!visible || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 z-50">
      <ul className="max-h-64 overflow-y-auto">
        {suggestions.map((city, index) => (
          <li key={index}>
            <button
              onClick={() => onSelect(city)}
              className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <MapPin size={18} className="text-amber-500" />
              <span>{city}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}