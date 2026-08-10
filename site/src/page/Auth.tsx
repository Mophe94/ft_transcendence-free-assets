import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../content/Loading';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkUserStatus } = useAuth();
  const isProcessed = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      if (isProcessed.current) return;
      isProcessed.current = true;
      const callbackUrl = `${import.meta.env.VITE_USERS_SERVICE}/auth/signin_42`;
      fetch(callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        credentials: 'include',
      })
        .then ((res) => {
          if (!res.ok) {
          throw new Error(`Auth failed with status ${res.status}`);
        }
      })
        .then(() => checkUserStatus())
        .then(() => new Promise((resolve) => setTimeout(resolve, 2000)))
        .then(() => navigate('/home'))
        .catch((err) => navigate(`/login?error=${err}`));
    } else {
      navigate(`/login?error=no_code`);
    }
  }, []);
  return (
    <Loading />
  );
}