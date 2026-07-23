import './Loading.css'
import fortyTwo from '../assets/forty-two.png'
import LoadingImg from '../assets/loading/loading.gif'


const loadStyles = {
  '--img42': `url(${fortyTwo})`,
} as React.CSSProperties;
export function Loading () {

    return (
        <div className='loading-container centered' style={loadStyles}>
            <img src={LoadingImg} className='loading-screen'alt='Loading' />
            <div className='loading-text centered'><span className='centered'>Loading...</span></div>
        </div>
    )
}