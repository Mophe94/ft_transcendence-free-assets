import { useCallback, useEffect, useRef, useState } from "react";
import { inputClassName, inputErrorClassName, labelClassName} from "./SignUpConst";

interface EmailSignUpProps {
  value: string;
  onChange: (email: string, isValidandAvailable: boolean) => void;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function SignUpEmail ({ value, onChange }: EmailSignUpProps) {
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const lastCheckedEmail = useRef<string>('');

  const checkEmail = useCallback(async (email: string) => {
    if (!isValidEmail(email) || email === lastCheckedEmail.current) return;

    setIsCheckingEmail(true);
    try {
    const res = await fetch(
        `${import.meta.env.VITE_USERS_SERVICE}/check_email?email=${encodeURIComponent(email)}`
    );
    const { available } = await res.json();
    
    lastCheckedEmail.current = email;
    setIsEmailAvailable(available);
    onChange(email, available)
    } catch {
    setIsEmailAvailable(null);
    } finally {
    setIsCheckingEmail(false);
    }
  }, [onChange]);

  useEffect(() => {
    if (!isValidEmail(value)) return;

    const timer = setTimeout(() => {
      checkEmail(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, checkEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmailFormatError(false);
    setIsEmailAvailable(null);
    onChange(newEmail, false);
  };

  const handleEmailBlur = () => {
    const trimmed = value.trim();
    if (trimmed && !isValidEmail(trimmed)) {
      setEmailFormatError(true);
    } else if (trimmed) {
      checkEmail(trimmed);
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <label htmlFor="email-input" className={labelClassName}>
            Email
        </label>
        <span className={`${!emailFormatError && "hidden "} ${inputErrorClassName}`}>
          Not a valid email
        </span>
        <span className={`${(emailFormatError || isCheckingEmail || isEmailAvailable !== false) && "hidden "} ${inputErrorClassName}`}>
          Email already used
        </span>
      </div>
      <input
        id="email-input"
        name="email"
        type="email"
        required={true}
        onChange={handleChange}
        onBlur={handleEmailBlur}
        value={value}
        className={inputClassName}/>
    </>
    );

}