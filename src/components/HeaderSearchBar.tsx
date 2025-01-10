import { Search, X } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
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
      setIsExpanded(false);
      onSearch(city.trim());
      setShowSuggestions(false);
      navigate('/');
    }
  };

  const handleSelect = (selectedCity: string) => {
    setCity(selectedCity);
    setIsExpanded(false);
    onSearch(selectedCity);
    setShowSuggestions(false);
    navigate('/');
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        wrapperRef.current?.querySelector('input')?.focus();
      }, 100);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full md:w-auto">
      {/* Mobile Search Button */}
      <button
        onClick={toggleSearch}
        className={`md:hidden ml-auto flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 ${isExpanded ? 'text-green-600' : ''}`}
      >
        <Search size={20} />
      </button>

      {/* Desktop Search Bar */}
      <div className={`
        fixed md:relative inset-x-0 top-[72px] md:top-auto
        ${isExpanded ? 'flex' : 'hidden md:flex'}
        w-full md:w-[400px] bg-white shadow-lg md:shadow-none md:bg-transparent
        items-center px-4 py-3 md:p-0 border-t border-gray-100 md:border-0
        z-50
      `}>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center">
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search breweries by city..."
              className="w-full h-10 px-4 pl-10 pr-20 text-sm rounded-lg border-2 border-gray-200 bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 text-gray-400" size={18} />
            <button
              type="submit"
              className="absolute right-2 px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors md:hidden"
            >
              Search
            </button>
          </div>
        </form>

        <Suggestions
          suggestions={suggestions}
          onSelect={handleSelect}
          visible={showSuggestions && (isExpanded || window.innerWidth >= 768)}
        />
      </div>
    </div>
  );
}