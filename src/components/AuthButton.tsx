import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { LogIn, UserCircle } from 'lucide-react';
import AuthModal from './AuthModal';

export default function AuthButton() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (user) {
      signOut();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-3 h-8 text-sm border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        {user ? <UserCircle size={16} /> : <LogIn size={16} />}
        {user ? 'Sign Out' : 'Sign In'}
      </button>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}