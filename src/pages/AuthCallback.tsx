import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session to confirm authentication
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          // Try to get the intended path from localStorage
          const intendedPath = localStorage.getItem('authRedirectPath') || '/';
          localStorage.removeItem('authRedirectPath'); // Clean up
          
          // Redirect to the intended path
          navigate(intendedPath, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <LoadingSpinner />;
}