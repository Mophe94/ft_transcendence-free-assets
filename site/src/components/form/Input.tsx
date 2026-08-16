import React from 'react';

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  label?: string;
  error?: string;
}

export default function Input({label, error, ...props}: InputProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input
        className='bg-white border-solid border rounded'
        {...props}
      />
      {error && <span>{error}</span>}
    </div>
  );
}