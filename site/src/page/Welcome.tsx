import { useEffect, useRef, useState } from 'react';
import { Banner } from '../components/Banner';
import { ButtonColor } from '../constants/Colors';
import AuthForm from '../components/form/AuthForm/AuthForm';
import ColoredButton from '../components/buttons/ColoredButton';

export default function Landing() {
  const [signin, setSignin] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);


  const displaySignin = () => {
    setSignin(!signin);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setSignin(false);
      }
    };

    if (signin) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [signin]);


  return (
    <div className="flex flex-col pt-[2vh] w-full">
      <div className="mb-[clamp(0.5rem,3vw,6rem)]">
        <Banner />
      </div>
      <div className=' flex justify-center '>
        <ColoredButton
          color={ButtonColor.Red}
          text="Enter"
          func={displaySignin}
          className="text-[clamp(0.5rem,2.5vw,5rem)] px-2"
        />
      </div>
        <div className={`${signin? 'block': 'hidden'} w-full h-full backdrop-blur-sm fixed inset-0 bg-black/40 z-50`}>
          <div ref={formRef} className={`${signin? 'block': 'hidden'}`}>
            <AuthForm/>
          </div>
        </div>
    </div>
  );
}