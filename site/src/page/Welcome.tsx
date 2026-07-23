import { Banner } from '../components/Banner';
import { EnterButton } from '../components/buttons/EnterButton';
import './Welcome.css';

export default function Landing() {
  return (
    <div className="home-layout">
      <div className="game_banner">
        <Banner />
      </div>
      <EnterButton />
    </div>
  );
}
