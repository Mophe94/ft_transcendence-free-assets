import { useState } from 'react';
import { Banner } from '../components/Banner';
import { EnterButton } from '../components/buttons/EnterButton';
import GenericButton from '../components/buttons/GenericButton';
import { ButtonColor } from '../constants/Colors';
import './Welcome.css';
import SignIn from './SignIn';




export default function Landing() {
  const [signin, setSignin] = useState<boolean>(false);




  const displaySignin = () => {
    setSignin(!signin);
  }
  return (
    <div className="home-layout">
      <div className="game-banner">
        <Banner />
      </div>
      <div className='enter-button-container'>
        <GenericButton color={ButtonColor.Red} func={displaySignin}/>
      </div>
      {signin && <SignIn/>}
    </div>
  );
}
