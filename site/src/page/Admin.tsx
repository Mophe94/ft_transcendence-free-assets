import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RegularBG from '../background/RegularBg';

export default function Admin() {
  const context = useAuth();
  const navigate = useNavigate();
  // useEffect(() => {
  //   const user = context.user;
  //   if (!user || user.role !== 'admin') navigate('/');
  //   //LOGIC TO IMPLEMENT
  // }, [context.user, navigate]);

  return (
    // HTML TO IMPLEMENT
    <div>
    <RegularBG><div>Admin Page</div></RegularBG>
    <div className='bor'>COUCOU</div></div>
  );
}
