import { Beer, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const BREWERY_TYPES = [
  'micro',
  'nano',
  'regional',
  'brewpub',
  'large',
  'bar',
  'proprietor',
] as const;

interface FilterControlsProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
}

export default function FilterControls({ selectedTypes, onTypeChange }: FilterControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypeChange(newTypes);
  };

  const clearFilters = () => {
    onTypeChange([]);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-gray-600 flex items-center gap-2">
        <Beer size={18} />
        Filter by type:
      </span>
      
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-700">
            {selectedTypes.length === 0
              ? 'All Types'
              : `${selectedTypes.length} Selected`}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
            <div className="px-3 pb-2 border-b border-gray-100">
              <button
                onClick={clearFilters}
                className="text-sm text-amber-500 hover:text-amber-600"
              >
                Clear all filters
              </button>
            </div>
            {BREWERY_TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                  className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="ml-3 text-gray-700 capitalize">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}