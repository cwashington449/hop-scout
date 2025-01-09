import { Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCitySuggestions } from '../services/cityApi';
import { useDebounce } from '../hooks/useDebounce';
import Suggestions from './Suggestions';
import { useNavigate } from 'react-router-dom';

interface HeaderSearchBarProps {
  onSearch: (city: string) => void;
}

export default function HeaderSearchBar({ onSearch }: HeaderSearchBarProps) {
  const [city, setCity] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedCity = useDebounce(city, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
      navigate('/');
    }
  };

  const handleSelect = (selectedCity: string) => {
    setCity(selectedCity);
    onSearch(selectedCity);
    setShowSuggestions(false);
    navigate('/');
  };

  return (
    <div ref={wrapperRef} className="w-full max-w-md relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search breweries by city..."
            className="w-full px-4 py-2 pl-10 text-sm rounded-lg border-2 border-gray-200 bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600 transition-colors"
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