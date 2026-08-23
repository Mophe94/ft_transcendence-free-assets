interface LetterKeyProps {
    kkey:string;
}

export default function LetterKey({kkey}: LetterKeyProps) {
  return (
    <div className='
      border-2 border-solid border-[rgb(38,38,38)]
      text-center content-center
      h-[clamp(1.5rem,3vw,3rem)] aspect-square
      bg-[rgb(221,220,220)] rounded-sm
      shadow-[4px_4px_5px_rgba(121,121,121,0.8)]'
    >
      {kkey}
    </div>
  );
}