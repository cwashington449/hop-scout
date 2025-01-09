import { ArrowUpDown } from 'lucide-react';
import type { SortConfig, SortField } from '../types/brewery';

interface SortControlsProps {
  sort: SortConfig;
  onSortChange: (sort: SortConfig) => void;
}

export default function SortControls({ sort, onSortChange }: SortControlsProps) {
  const handleSortChange = (field: SortField) => {
    if (sort.field === field) {
      // Toggle order if same field
      onSortChange({ field, order: sort.order === 'asc' ? 'desc' : 'asc' });
    } else {
      // Default to ascending for new field
      onSortChange({ field, order: 'asc' });
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-gray-600">Sort by:</span>
      <button
        onClick={() => handleSortChange('name')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
          sort.field === 'name'
            ? 'bg-amber-500 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Name
        {sort.field === 'name' && (
          <ArrowUpDown size={16} className="text-white" />
        )}
      </button>
      <button
        onClick={() => handleSortChange('brewery_type')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
          sort.field === 'brewery_type'
            ? 'bg-amber-500 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Type
        {sort.field === 'brewery_type' && (
          <ArrowUpDown size={16} className="text-white" />
        )}
      </button>
    </div>
  );
}