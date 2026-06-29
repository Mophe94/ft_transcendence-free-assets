import { createContext, useContext } from 'react';
import type { User } from '../types/user';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  handleSignout: () => Promise<void>;
  checkUserStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('UseAuth needs to be executed inside AuthProvider.');
  }

  return context;
};
