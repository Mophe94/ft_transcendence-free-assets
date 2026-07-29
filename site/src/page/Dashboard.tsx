import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const context = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const user = context.user;
    if (!user || user.role !== 'admin') navigate('/');
    //LOGIC TO IMPLEMENT
  }, [context.user, navigate]);

  return (
    // HTML TO IMPLEMENT
    <div>Admin Page</div>
  );
}
