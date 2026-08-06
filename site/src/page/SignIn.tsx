import { useState } from "react";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
}

interface SignInFormData {
  email: string;
  password: string;
}


export default function SignIn() {
  const [isSignin, setIsSignin] = useState<boolean>(true);
  const [signInData, setSignInData] = useState<SignInFormData>({
    email: '',
    password: '',
  });
  const [signUpData, setSignUpData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
  });

  const toggleConnect = () => {
    setIsSignin(true);
  }
  const toggleSignup = () => {
    setIsSignin(false);
  }

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value} = e.target;
    setSignUpData((prev) => ({...prev, [name]: value}));
    console.log(signUpData);
  }

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value} = e.target;
    setSignInData((prev) => ({...prev, [name]: value}));
    console.log(signInData);
  }

  const signUpUser = async () => {

    const res = await fetch(`${import.meta.env.VITE_USERS_SERVICE}/auth/signup`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpData),
      method: 'POST',
      credentials: 'include',
    })
    console.log(res);
  }
  const signInUser = async () => {

    const res = await fetch(`${import.meta.env.VITE_USERS_SERVICE}/auth/signin`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signInData),
      method: 'POST',
      credentials: 'include',
    })
    console.log(res);
  }


  return (
      <div className="bg-[#e0ce9e]
        border-2 rounded-md border-[#45341e] w-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bor">
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
        {isSignin? 
        (
          <form id="signin" onSubmit={(e) => e.preventDefault()}className="flex flex-col p-3">
            <label>Email</label>
            <input
              name="email"
              type="email"
              required={true}
              onChange={handleSignInChange}
              className="border-[#191107] border-2"></input>
            <label>Password</label>
            <input
              name="password"
              type="password"
              required={true}
              onChange={handleSignInChange}
              className="border-[#191107] border-2"></input>
            <div className="flex flex-row justify-around mt-3">
              <button
                type="submit"
                onClick={signInUser}
                className="bg-red-600 border-2 rounded border-yellow-200 w-30"
              >
                Enter
              </button>
              <button className="bg-black border-2 rounded border-white text-white w-30">42</button>
            </div>
          </form>
        ):(
          <form id="signup" onSubmit={(e) => e.preventDefault()} className="flex flex-col p-3 w-80">
            <label>Email</label>
            <input
              name="email"
              type="email"
              required={true}
              onChange={handleSignUpChange}
              className="border-[#191107] border-2"/>
            <label>Username</label>
            <input
              name="username"
              type="text"
              required={true}
              onChange={handleSignUpChange}
              className="border-[#191107] border-2"/>
            <label>Password</label>
            <input
              name="password"
              type="password"
              required={true}
              onChange={handleSignUpChange}
              className="border-[#191107] border-2"/>
            <label>Confirm Password</label>
            <input
              type="password"
              required={true}
              className="border-[#191107] border-2"/>
            <div className="flex flex-row justify-around mt-3">
              <button
                type="button"
                onClick={signUpUser}
                className="bg-red-600 border-2 rounded border-yellow-200 w-50"
              >Join the Battle</button>
            </div>
          </form>)}
      </div>
  )
}