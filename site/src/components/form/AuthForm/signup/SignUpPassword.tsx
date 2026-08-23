import { useState } from 'react';
import { inputClassName, inputErrorClassName, labelClassName} from './SignUpConst';

interface SignUpPasswordProps {
  passwordValue: string;
  confirmValue: string;
  onChange: (password: string, confirmPassword: string, isValid: boolean) => void;
}

const isPasswordValid = (password: string) => password.length >= 8 && password.length <= 20;

export default function SignUpPassword({
  passwordValue,
  confirmValue,
  onChange,
}: SignUpPasswordProps) {
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);

  const isMatching = isPasswordValid(passwordValue) && passwordValue === confirmValue;


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value;
    onChange(newPass, confirmValue, newPass.length >= 6 && newPass === confirmValue);
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirm = e.target.value;
    onChange(passwordValue, newConfirm, passwordValue.length >= 6 && passwordValue === newConfirm);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between mt-3">
        <label htmlFor="password-input" className={labelClassName}>Password</label>
        {!isPasswordValid(passwordValue) && passwordValue.length > 0 && (
        <span className={inputErrorClassName}>Needs 8 to 20 chars.</span>
        )}
      </div>
      <input
        id="password-input"
        type="password"
        required
        value={passwordValue}
        onChange={handlePasswordChange}
        className={inputClassName}
      />
      

      <div className="flex flex-row justify-between mt-3">
        <label htmlFor="confirm-password-input" className={labelClassName}>Confirm Password</label>
         {isConfirmFocused && confirmValue.length > 0 && !isMatching && (
        <span className={inputErrorClassName}>Passwords don't mach</span>
      )}
      </div>
      <input
        id="confirm-password-input"
        type="password"
        required
        value={confirmValue}
        onChange={handleConfirmChange}
        onFocus={() => setIsConfirmFocused(true)}
        onBlur={() => setIsConfirmFocused(false)}
        className={inputClassName}
      />

     
    </div>
  );
};