import { Link } from 'react-router-dom';
import './EnterButton.css';
import { useAuth } from '../../context/AuthContext';

import enterBtnReg from '../../assets/buttons/enter_button/enter_button_text.png'
import enterBtnPressed from '../../assets/buttons/enter_button/enter_button_pushed_text.png'


export function EnterButton() {
  const { user, isLoading } = useAuth();

  const enterLink =
    !user || isLoading ? (
      <a href={import.meta.env.VITE_42_OAUTH_API_LINK}>
        <img className="normal_button" src={enterBtnReg} />
        <img
          className="display_on_hover"
          src={enterBtnPressed}
        />
      </a>
    ) : (
      <Link to={'/home'}>
        <img className="normal_button" src={enterBtnReg} />
        <img
          className="display_on_hover"
          src={enterBtnPressed}
        />
      </Link>
    );
  return (
    <div className="button-container">
      <div className="img-container">{enterLink}</div>
    </div>
  );
}
