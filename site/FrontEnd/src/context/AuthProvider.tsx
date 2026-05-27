import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/user";


export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkUserStatus = async () => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include'
        })
        .then( res => {
            if (!res.ok) {
                throw new Error('User not authenticated');  
            }
            return res.json();
        })
        .then((data: User) => {
            console.log(data); setUser(data);})
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
    useEffect(() => {
        checkUserStatus()
    }, [])

    const handleSignout = async () => {
        const signoutUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/signout`;
        await fetch(signoutUrl, {
            method: 'POST',
            credentials: 'include'
        }).finally(() => {
            setUser(null);
        });
    }
    return (
        <AuthContext.Provider value={{ user, loading, handleSignout, checkUserStatus}}>
            {children}
        </AuthContext.Provider>
    );
};
