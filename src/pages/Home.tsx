import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import Hero from '../components/Hero';
import TopCities from '../components/TopCities';
import FilterControls from '../components/FilterControls';
import BreweryCard from '../components/BreweryCard';
import SortControls from '../components/SortControls';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer';
import type { Brewery, SortConfig } from '../types/brewery';
import { searchBreweries } from '../services/breweryApi';

const ITEMS_PER_PAGE = 25;

export default function Home() {
  const [searchCity, setSearchCity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortConfig>({
    field: 'name',
    order: 'asc'
  });

  const { 
    data: breweries = [], 
    isLoading, 
    isError 
  } = useQuery<Brewery[]>({
    queryKey: ['breweries', searchCity],
    queryFn: () => searchBreweries(searchCity),
    enabled: !!searchCity,
  });

  const sortedBreweries = useMemo(() => {
    return [...breweries].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (sort.order === 'asc') {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });
  }, [breweries, sort]);

  const filteredBreweries = useMemo(() => {
    if (selectedTypes.length === 0) return sortedBreweries;
    return sortedBreweries.filter(brewery => selectedTypes.includes(brewery.brewery_type));
  }, [sortedBreweries, selectedTypes]);

  const totalPages = Math.ceil(sortedBreweries.length / ITEMS_PER_PAGE);
  const paginatedBreweries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBreweries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBreweries, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleReset = () => {
    setSearchCity('');
    setSelectedTypes([]);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {searchCity ? (
        <Header 
          onReset={handleReset}
          onSearch={setSearchCity}
        />
      ) : (
        <Hero onSearch={setSearchCity} />
      )}

      {!searchCity && <TopCities onCitySelect={setSearchCity} />}

      <main className="max-w-7xl mx-auto px-4 py-12 flex-grow">
        {searchCity && (
          <>
            {!isLoading && !isError && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Breweries in {searchCity}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Found {filteredBreweries.length} breweries in your area
                    {selectedTypes.length > 0 && (
                      <span className="text-amber-500">
                        {' '}
                        (Filtered by {selectedTypes.length} type{selectedTypes.length > 1 ? 's' : ''})
                      </span>
                    )}
                  </p>
                </div>

                <FilterControls
                  selectedTypes={selectedTypes}
                  onTypeChange={handleTypeChange}
                />

                <SortControls
                  sort={sort}
                  onSortChange={setSort}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedBreweries.map((brewery) => (
                    <BreweryCard key={brewery.id} brewery={brewery} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto" />
              </div>
            )}

            {isError && (
              <div className="text-center py-12 text-red-600">
                Error loading breweries. Please try again.
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}