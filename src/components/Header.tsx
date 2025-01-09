import { Hop } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import HeaderSearchBar from './HeaderSearchBar';

interface HeaderProps {
  onReset: () => void;
  onSearch?: (city: string) => void;
}

export default function Header({ onReset, onSearch }: HeaderProps) {
  const location = useLocation();
  const showSearch = onSearch !== undefined;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-amber-500 hover:text-amber-600 w-fit"
        >
          <Hop size={24} />
          <span className="text-xl font-semibold">Hop Scout</span>
        </button>
        {showSearch && (
          <HeaderSearchBar onSearch={onSearch} />
        )}
      </div>
    </header>
  );
}