import { createContext, useContext } from "react";

export interface User {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    handleSignout: () => Promise<void>;
    checkUserStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error("UseAuth needs to be executed inside AuthProvider.");
    }
    
    return context;
};