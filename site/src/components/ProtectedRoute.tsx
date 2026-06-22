import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';


export function ProtectedRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}