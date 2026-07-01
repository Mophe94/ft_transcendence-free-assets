import { Banner } from '../components/Banner';
import { EnterButton } from '../components/EnterButton';
import './Welcome.css';

export function Landing() {
  return (
    <div className="home-layout">
      <div className="game_banner">
        <Banner />
      </div>
      <EnterButton />
    </div>
  );
}
