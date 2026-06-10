import "./PlayButton.css"
import { useNavigate } from 'react-router-dom';

export function PlayButton () {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/play');
  }
    return (
        <button className="play-button" onClick={handleClick}>
            Play&nbsp;!
        </button>
    );
}

