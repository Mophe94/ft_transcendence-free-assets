
import { useQuery } from '@tanstack/react-query';

export const useFriends = () => {
  return useQuery({
    queryKey: ['friends', 'currentFriends'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_USERS_SERVICE}/friends/`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error loading friends');
      return res.json();
    },
  });
};