import { useAuth } from '../contexts/AuthContext';

export default function AuthButton() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <button
      onClick={user ? signOut : signInWithGoogle}
      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
    >
      {user ? 'Sign Out' : 'Sign in with Google'}
    </button>
  );
}