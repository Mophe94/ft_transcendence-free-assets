import { useState } from "react";
import { ButtonColor } from "../../../../constants/Colors";
import { inputClassName, labelClassName } from "../signup/SignUpConst";
import ColoredButton from "../../../buttons/ColoredButton";
import { useNotification } from "../../../../context/NotifContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

interface SignInFormData {
  email: string;
  password: string;
}
export default function SignInForm () {
  const { setUser } = useAuth();
  const [signInData, setSignInData] = useState<SignInFormData>({
    email: '',
    password: '',
  });
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value} = e.target;
    setSignInData((prev) => ({...prev, [name]: value}));
  }
  
  const handleSignIn = async () => {

    try {
      const res = await fetch(`${import.meta.env.VITE_USERS_SERVICE}/auth/signin`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signInData),
      method: 'POST',
      credentials: 'include',
      })
      if(!res.ok) {
        showNotification('Wrong Credentials', 'error');
        return;
      }
      const userData = await res.json();

      setUser(userData);
      navigate('/home');
    } catch {
        showNotification('An error occured', 'error');
    }
  }

  const redirectFortyTwo = () => {
    window.location.href = import.meta.env.VITE_42_OAUTH_API_LINK;
  }

  return (
    <form id="signin" onSubmit={(e) => e.preventDefault()} className="flex flex-col p-3 w-full gap-3">
      <label htmlFor="email" className={labelClassName}>Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required={true}
        autoComplete="email"
        onChange={handleSignInChange}
        className={inputClassName}>
      </input>
      
      <label htmlFor="password" className={labelClassName}>Password</label>
      <input
        name="password"
        type="password"
        required={true}
        onChange={handleSignInChange}
        className={inputClassName}>
      </input>
      
      <div className="flex flex-row justify-around mt-3 h-[clamp(2.5rem,11vw,4rem)] w-full">
        <div>
          <ColoredButton
            color={ButtonColor.Red}
            text="Enter"
            func={handleSignIn}
            className=""
          />
        </div>
        <div>
          <ColoredButton
            color={ButtonColor.Black}
            text="42"
            func={redirectFortyTwo}
            className="px-3"
          />
        </div>
      </div>
    </form>
  );
}