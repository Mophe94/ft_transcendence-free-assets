import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    useEffect(() => {
        if (!loading && !user) {
            window.location.href = import.meta.env.VITE_42_OAUTH_API_LINK;
        }
    }, [user, loading]);
    if (loading) {
        return <div className="loading-screen">Loading..</div>;
    }
    return <>{children}</>;
}