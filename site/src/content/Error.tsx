 import './Error.css'

import errorGif from '../assets/others/DinoCrying.gif';
import RegularBG from '../background/RegularBg';


export interface ErrorDisplayProps {
  code: number,
  msg: string,
}

export default function ErrorDisplay({msg = 'Page not found', code}: ErrorDisplayProps) {

  return (
    <RegularBG>
      <div className='error-heading centered'>Error {code}</div>
      <div className='error-msg centered'>{msg}</div>
      <img src={errorGif} alt='error-image'/>
    </RegularBG>
    );
}