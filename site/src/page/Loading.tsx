import './Loading.css'
import LoadingImg from '../assets/loading/loading.gif'

export function Loading () {

    return (
        <div className='loading-container centered'>
            <img src={LoadingImg} className='loading-screen'alt='Loading' />
            <div className='loading-text centered'><span className='centered'>Loading...</span></div>
        </div>
    )
}