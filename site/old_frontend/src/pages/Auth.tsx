import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkUserStatus } = useAuth();

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            const callbackUrl = `${import.meta.env.VITE_USERS_SERVICES}/auth/signin`;
            fetch(callbackUrl,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({ code }),
                    credentials: 'include'
                })
                .then(() => checkUserStatus())
                .then(() => navigate('/'))
                .catch(err => navigate(`/login?error=${err}`)
            )
        }
        else {
            navigate(`/login?error=no_code`)
        }
    })
    return (
        <div className="auth-loading-scree">
            <p>Loading...</p>
        </div>
  );
}