import { useState, useEffect, useRef, useCallback } from 'react';
import { inputClassName, inputErrorClassName, labelClassName} from './SignUpConst';

interface SignUpUsernameProps {
  value: string;
  onChange: (username: string, isValidAndAvailable: boolean) => void;
}

const isValidUsername = (u: string) => u.trim().length >= 5 && u.trim().length <= 15;

export default function SignUpUsername({ value, onChange }: SignUpUsernameProps) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [formatError, setFormatError] = useState(false);
  const lastChecked = useRef('');

  const checkUsername = useCallback(async (username: string) => {
    if (!isValidUsername(username) || username === lastChecked.current) return;

    setIsChecking(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_USERS_SERVICE}/check_username?username=${encodeURIComponent(username)}`
      );
      const data = await res.json();
      const available = typeof data === 'boolean' ? data : data.available;
      
      lastChecked.current = username;
      setIsAvailable(available);
      onChange(username, available);
    } catch {
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, [onChange]);

  useEffect(() => {
    if (!isValidUsername(value)) return;

    const timer = setTimeout(() => checkUsername(value), 500);
    return () => clearTimeout(timer);
  }, [value, checkUsername]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormatError(false);
    setIsAvailable(null);
    onChange(e.target.value, false);
  };

  const handleBlur = () => {
    const trimmed = value.trim();
    if (trimmed && !isValidUsername(trimmed)) {
      setFormatError(true);
    } else if (trimmed) {
      checkUsername(trimmed);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between mt-3">
        <label htmlFor='username-input' className={labelClassName}>Username</label>
        {formatError && (
          <span className={inputErrorClassName}>Min 5 to 15 chars.</span>
        )}
        {!formatError && !isChecking && isAvailable === false && (
          <span className={inputErrorClassName}>Username not available</span>
        )}
      </div>
      <input
        id='username-input'
        type="text"
        required
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={inputClassName}
      />
    </div>
  );
};