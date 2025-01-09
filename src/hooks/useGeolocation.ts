import { useState, useEffect } from 'react';

interface Location {
  city: string;
  state: string;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location>({
    city: 'Austin',
    state: 'TX',
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          setLocation({
            city: data.city || 'Austin',
            state: data.principalSubdivision || 'TX',
            loading: false,
            error: null
          });
        } catch (error) {
          setLocation({
            city: 'Austin',
            state: 'TX',
            loading: false,
            error: 'Failed to get location'
          });
        }
      },
      () => {
        setLocation({
          city: 'Austin',
          state: 'TX',
          loading: false,
          error: 'Unable to retrieve location'
        });
      }
    );
  }, []);

  return location;
}