import { useQuery } from '@tanstack/react-query';
import { getBreweryEvents } from '../services/eventApi';

export function useBreweryEvents(breweryId: string) {
  return useQuery({
    queryKey: ['breweryEvents', breweryId],
    queryFn: () => getBreweryEvents(breweryId),
    enabled: !!breweryId,
  });
}