import './LetterKey.css'

interface LetterKeyProps {
    kkey:string;
}

export default function LetterKey({kkey}: LetterKeyProps) {
  return (
    <div className='key'>{kkey}</div>
  );
}