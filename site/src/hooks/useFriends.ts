
import { useQuery } from '@tanstack/react-query';
import type Friends from '../types/friend';

export const useFriends = () => {
  return useQuery<Friends, Error>({
    queryKey: ['friends', 'currentFriends'],
    queryFn: async (): Promise<Friends> => {
      const res = await fetch(`${import.meta.env.VITE_USERS_SERVICE}/friends/`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error loading friends');
      return res.json();
    },
  });
};