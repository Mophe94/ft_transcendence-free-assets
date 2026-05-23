import "./Home.css"

import gameBanner from '../assets/images/banner.gif'
import {PlayButton} from "../components/Buttons/Button";
import { RectMediaWindow } from "../components/MediaWindow/RectMediaWindow";
import {TextWindow} from "../components/Text/TextWindow";

export default function Home() {
    return (
        <div className="content">
            <div className="gameBanner">
                <img src={gameBanner} alt="Banner" />
            </div>
            <HomeBody />
        </div>
  );
}


export function HomeBody () {
  return (
    <div className="home-content-layout">
      <Media1 />
      <TextWindow title="Most loved game by its creators&nbsp;!" containerId="content1" />
      <RectMediaWindow type="img" src="./src/assets/images/stars.png" alt="stars" containerId="media2"/>
      <TextWindow title="Always at least one player when you connect." containerId="content2" />
      <RectMediaWindow type="img" src="./src/assets/images/mutenroshi.png" alt="Tortue Géniale" containerId="media3"/>
      <TextWindow title="More fun to play than to code&nbsp;!" containerId="content3" />
    </div>
  );
}

function Media1 () {
  return (
    <div className="" id="media1">
      <PlayButton />
    </div>
  );
}

