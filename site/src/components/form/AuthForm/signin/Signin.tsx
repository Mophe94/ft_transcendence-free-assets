import { useState } from "react";
import ColorButton from "../../../buttons/ColoredButton";
import { ButtonColor } from "../../../../constants/Colors";
import { inputClassName, labelClassName } from "../signup/SignUpConst";

interface SignInFormData {
  email: string;
  password: string;
}
export default function SignInForm () {
  const [signInData, setSignInData] = useState<SignInFormData>({
    email: '',
    password: '',
  });

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value} = e.target;
    setSignInData((prev) => ({...prev, [name]: value}));
    console.log(signInData);
  }
  
  const signInUser = async () => {

    await fetch(`${import.meta.env.VITE_USERS_SERVICE}/auth/signin`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signInData),
      method: 'POST',
      credentials: 'include',
    })
    .then((res) => {
      console.log(res);
    })
    
  }
  return (
    <form id="signin" onSubmit={(e) => e.preventDefault()}className="flex flex-col p-3 w-full gap-3">
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
          <ColorButton
            color={ButtonColor.Red}
            text="Enter"
            func={signInUser}
            className="h-full w-full"
          />
        </div>
        <div>
          <ColorButton
            color={ButtonColor.Black}
            text="42"
            func={() => {}}
            className="h-full w-full"
          />
        </div>
      </div>
    </form>
  );
}