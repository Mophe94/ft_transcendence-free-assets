import './Loading.css'
import fortyTwo from '../assets/forty-two.png'
import LoadingImg from '../assets/loading/loading.gif'
import SpecialBG from '../background/SpecialBg';


const loadStyles = {
  '--img42': `url(${fortyTwo})`,
} as React.CSSProperties;
export function Loading () {

  return (
    <SpecialBG>
      <div className='loading-container centered' style={loadStyles}>
        <img src={LoadingImg} className='loading-screen'alt='Loading' />
        <div className='loading-text centered'><span className='centered'>Loading...</span></div>
      </div>
    </SpecialBG>
  )
}