import { Hop } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import HeaderSearchBar from './HeaderSearchBar';
import AuthButton from './AuthButton';

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
          className="flex items-center gap-2 text-green-600 hover:text-green-700 w-fit h-10"
        >
          <Hop size={24} />
          <span className="text-xl font-semibold">Hop Scout</span>
        </button>
        {showSearch && (
          <div className="flex-1 flex justify-center px-4">
            <HeaderSearchBar onSearch={onSearch} />
          </div>
        )}
        <div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}