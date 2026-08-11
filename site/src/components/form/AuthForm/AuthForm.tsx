import { useState } from "react";
import SignUpForm from "./signup/SignUp";
import SignInForm from "./signin/Signin";



export default function AuthForm() {
  const [isSignin, setIsSignin] = useState<boolean>(true);

  const toggleConnect = () => {
    setIsSignin(true);
  }
  const toggleSignup = () => {
    setIsSignin(false);
  }

  return (
      <div className="
        absolute top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2
        w-1/2 h-[clamp(0rem,60vw,550px)]  max-w-120 min-w-80 min-h-80
        bg-[#e0ce9e] border-2 rounded-md border-[#45341e]">
        <div className="grid grid-cols-2 justify-center">
          <div
            onClick={toggleConnect}
            className={`text-center ${isSignin ? "bg-[#e0ce9e] text-[#191107]": "bg-[#191107] text-[#e0ce9e]"}`}
          >
            Connexion
          </div>
          <div
            onClick={toggleSignup}
            className={`text-center ${!isSignin ? "bg-[#e0ce9e] text-[#191107]": "bg-[#191107] text-[#e0ce9e]"}`}
          >Register</div>
        </div>
        <div className="flex flex-col justify-center items-center h-full">
          <div className={`${isSignin? 'flex':'hidden'} h-min w-9/10 items-center`}>
            <SignInForm/>
          </div>
          <div className={`${!isSignin? 'flex':'hidden'} w-9/10 justify-center`}>
            <SignUpForm/>
          </div>
        </div>
      </div>
  )
}