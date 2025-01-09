import React from 'react';
import SearchBar from './SearchBar';

interface HeroProps {
  onSearch: (city: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img
          src="https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&q=80&w=2000"
          alt="Craft Beer Taps"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-center animate-fade-in">
          Discover Breweries &
          <span className="block mt-2 text-amber-400">What's Brewing Tonight</span>
        </h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl text-center animate-fade-in-delay">
          Explore local breweries and tap rooms, then see what's happening there – from trivia nights to tap takeovers, find the perfect spot for tonight or plan your next beer adventure.  
        </p>
        <div className="w-full max-w-3xl animate-fade-in-delay-2">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
}