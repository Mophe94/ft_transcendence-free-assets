import "./Home.css"

import gameBanner from '../assets/images/banner.gif'
import PlayButton from "../components/Button";
import MediaWindow from "../components/MediaWindow";
import TextWindow from "../components/TextWindow";

export default function Home() {
    return (
        <div className="content">
            <div className="gameBanner">
                <img src={gameBanner} alt="Banner" />
            </div>
            <Body />
        </div>
  );
}


function Body () {
  return (
    <div className="content-layout">
      <Media1 />
      <TextWindow title="Most loved game by its creators&nbsp;!" containerId="content1" />
      <MediaWindow type="img" src="./src/assets/images/stars.png" alt="stars" containerId="media2"/>
      <TextWindow title="Always at least one player when you connect." containerId="content2" />
      <MediaWindow type="img" src="./src/assets/images/mutenroshi.png" alt="Tortue Géniale" containerId="media3"/>
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

