import { useNavigate } from 'react-router-dom'
import './EnterButton.css'
export function EnterButton() {

    const navigate = useNavigate();
    const enterWebsite = () => {
        navigate(import.meta.env.VITE_42_OAUTH_API_LINK);
    }

    return (
        <div className='button-container'>
            <div className='img-container'>
                <a href={import.meta.env.VITE_42_OAUTH_API_LINK}>
                    <img className="normal_button" src='src/assets/enter_button_text.png' />
                    <img className="display_on_hover" src='src/assets/enter_button_pushed_text.png' />
                </a>

            </div>
        </div>
    )
}