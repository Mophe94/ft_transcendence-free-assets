import { useState } from "react";
import SignUpUsername from "./SignUpUsername";
import SignUpEmail from "./SignUpEmail";
import SignUpPassword from "./SignUpPassword";
import { useNotification } from "../../../../context/NotifContext";
import { ButtonColor } from "../../../../constants/Colors";
import ColoredButton from "../../../buttons/ColoredButton";


export default function SignUpForm() {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [validity, setValidity] = useState({
    emailValid: false,
    usernameValid: false,
    passwordValid: false,
  });

  const handleSignUp = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const { confirmPassword, ...payload } = formData;
    await fetch(`${import.meta.env.VITE_USERS_SERVICE}/auth/signup`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      method: 'POST',
      credentials: 'include',
    })
    .then ((res) => {
      if (res.ok) {
        showNotification('User creation success', 'success');
      } else {
        showNotification('User creation failed', 'error');
      }
    })
    
  };

  const isFormValid =
    validity.emailValid && validity.usernameValid && validity.passwordValid;


  return (
    <form id="signup" onSubmit={handleSignUp} className="flex flex-col p-3 w-full max-w-100 align-center">
      <SignUpEmail
        value={formData.email}
        onChange={(email, isValid) => {
          setFormData((prev) => ({ ...prev, email }));
          setValidity((prev) => ({ ...prev, emailValid: isValid }));
        }}
      />
      <SignUpUsername
        value={formData.username}
        onChange={(username, isValid) => {
          setFormData((prev) => ({ ...prev, username }));
          setValidity((prev) => ({ ...prev, usernameValid: isValid }));
        }}
      />
      <SignUpPassword
        passwordValue={formData.password}
        confirmValue={formData.confirmPassword}
        onChange={(password, confirmPassword, isValid) => {
          setFormData((prev) => ({ ...prev, password, confirmPassword }));
          setValidity((prev) => ({ ...prev, passwordValid: isValid }));
        }}
      />
      <div className="flex flex-row justify-around mt-4 h-[clamp(2.5rem,11vw,4rem)]">
        <ColoredButton
          color={ButtonColor.Red}
          text="Join the Battle"
          func={()=> {}}
          className="h-full"
        />

      </div>
    </form>
  );
}
