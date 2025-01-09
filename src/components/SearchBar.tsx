import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCitySuggestions } from '../services/cityApi';
import { useDebounce } from '../hooks/useDebounce';
import Suggestions from './Suggestions';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedCity = useDebounce(city, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: suggestions = [] } = useQuery({
    queryKey: ['citySuggestions', debouncedCity],
    queryFn: () => getCitySuggestions(debouncedCity),
    enabled: debouncedCity.length >= 2,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setShowSuggestions(false);
    }
  };

  const handleSelect = (selectedCity: string) => {
    setCity(selectedCity);
    onSearch(selectedCity);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="w-full relative">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Enter a city name..."
            className="w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/70" size={24} />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 px-8 py-2.5 bg-amber-400 text-gray-900 font-semibold rounded-full hover:bg-amber-300 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <Suggestions
        suggestions={suggestions}
        onSelect={handleSelect}
        visible={showSuggestions}
      />
    </div>
  );
}