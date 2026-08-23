import RegularBG from '../background/RegularBg';

import moveVid from '../assets/howto/movements.mp4';
import interactVid from '../assets/howto/interaction.mp4';
import captureVid from '../assets/howto/phase_capture.mp4';
import inventoryVid from '../assets/howto/inventory.mp4';
import discardVid from '../assets/howto/remove_obj.mp4';
import selectionVid from '../assets/howto/phase_combat_selection.mp4';
import teamVid from '../assets/howto/phase_combat_team_setup.mp4';
import Aswd from '../components/keyboard/Aswd';
import Key from '../components/keyboard/LetterKey';
import SpaceKey from '../components/keyboard/SpaceKey';

import cursor from '../assets/howto/cursor.png';
import Heading from '../components/heading/Heading';
import Sep from '../visualElements/Separator';

export default function HowToPlay() {
  return (
    <RegularBG>
      <div className="grid justify-items-center justify-self-center">
        
        <Heading text="How to Play" size="l"/>
        <div className="py-8">Essential controls & features before starting your adventure.</div>

        <div className="grid justify-items-center p-8 gap-8 lg:gap-12 lg:items-center lg:grid-cols-[2fr_5fr_3fr]">
          <div className="self-center">
            <Aswd />
          </div>
          <div className="w-[clamp(170px,40vw,550px)] lg:w-full lg:col-start-3">
            <video autoPlay loop muted playsInline>
              <source src={moveVid} type="video/mp4" />
            </video>
          </div>
          <div className="lg:col-start-2 lg:row-start-1 lg:w-full lg:flex lg:flex-col lg:content-center">
            <Heading text="Movement" size="sm" className='mb-4'/>
            <div className="text-justify lg:max-w-full">Use WASD to walk around, explore the world, and navigate through the map.</div>
          </div>
        </div>
        <Sep/>

        <div className="grid justify-items-center p-8 gap-8 lg:gap-12 lg:items-center lg:grid-cols-[3fr_5fr_2fr]">
          <div className="self-center lg:col-start-3">
            <Key kkey="E" />
          </div>
          <div className="w-[clamp(170px,40vw,550px)] lg:w-full lg:col-start-1 lg:row-start-1">
            <video autoPlay loop muted playsInline>
              <source src={interactVid} type="video/mp4" />
            </video>
          </div>
          <div className="lg:col-start-2 lg:row-start-1 lg:w-full lg:flex lg:flex-col lg:content-center">
            <Heading text="Interact" size="sm" className='mb-4'/>
            <div className="text-justify lg:max-w-full">Press E to trigger world elements, activate teleporters, and pick up items found in the world.</div>
          </div>
        </div>
        <Sep/>

        <div className="grid justify-items-center p-8 gap-8 lg:gap-12 lg:items-center lg:grid-cols-[2fr_5fr_3fr]">
          <div className="self-center flex items-center">
            <img src={cursor} alt="cursor" className="mr-6" />
            <div>Left Click</div>
          </div>
          <div className="w-[clamp(170px,40vw,550px)] lg:w-full lg:col-start-3">
            <video autoPlay loop muted playsInline>
              <source src={captureVid} type="video/mp4" />
            </video>
          </div>
          <div className="lg:col-start-2 lg:row-start-1 lg:w-full lg:flex lg:flex-col lg:content-center">
            <Heading text="Capture" size="sm" className='mb-4'/>
            <div className="text-justify lg:max-w-full">Interact with wild creatures to capture them and assemble a party of up to 6 monsters! Beware though: monsters can escape during capture!</div>
          </div>
        </div>
        <Sep />

        <div className="grid justify-items-center p-8 gap-8 lg:gap-12 lg:items-center lg:grid-cols-[3fr_5fr_2fr]">
          <div className="self-center lg:col-start-3">
            <SpaceKey />
          </div>
          <div className="w-[clamp(170px,40vw,550px)] lg:w-full lg:col-start-1 lg:row-start-1">
            <video autoPlay loop muted playsInline>
              <source src={inventoryVid} type="video/mp4" />
            </video>
          </div>
          <div className="lg:col-start-2 lg:row-start-1 lg:w-full lg:flex lg:flex-col lg:content-center">
            <Heading text="Inventory" size="sm" className='mb-4'/>
            <div className="text-justify lg:max-w-full">Press Spacebar anytime to open your inventory and manage your collected items.</div>
          </div>
        </div>
        <Sep />

        <div className="grid justify-items-center p-8 gap-8 lg:gap-12 lg:items-center lg:grid-cols-[2fr_5fr_3fr]">
          <div className="self-center flex items-center">
            <img src={cursor} alt="cursor" className="mr-6" />
            <div>Left Click</div>
          </div>
          <div className="w-[clamp(170px,40vw,550px)] lg:w-full lg:col-start-3">
            <video autoPlay loop muted playsInline>
              <source src={discardVid} type="video/mp4" />
            </video>
          </div>
          <div className="lg:col-start-2 lg:row-start-1 lg:w-full lg:flex lg:flex-col lg:content-center">
            <Heading text="Discard Item" size="sm" className='mb-4'/>
            <div className="text-justify lg:max-w-full">Left-click on any item inside your inventory to throw it away and free up space.</div>
          </div>
        </div>
        <Sep />

        <div className="grid justify-items-center p-8 gap-8 lg:gap-12 lg:items-center lg:grid-cols-[3fr_5fr_2fr]">
          <div className="self-center flex items-center lg:col-start-3">
            <img src={cursor} alt="cursor" className="mr-6" />
            <div>Left Click</div>
          </div>
          <div className="w-[clamp(170px,40vw,550px)] lg:w-full lg:col-start-1 lg:row-start-1">
            <video autoPlay loop muted playsInline>
              <source src={teamVid} type="video/mp4" />
            </video>
          </div>
          <div className="lg:col-start-2 lg:row-start-1 lg:w-full lg:flex lg:flex-col lg:content-center">
            <Heading text="Battle Preparation" size="sm" className='mb-4'/>
            <div className="text-justify lg:max-w-full">Prepare your lineup before the timer runs out. Out of your 6 captured monsters, carefully select the 3 fighters that will enter the arena!</div>
          </div>
        </div>
        <Sep />

        <div className="grid justify-items-center p-8 gap-8 lg:gap-12 lg:items-center lg:grid-cols-[2fr_5fr_3fr]">
          <div className="self-center flex items-center">
            <img src={cursor} alt="cursor" className="mr-6" />
            <div>Left Click</div>
          </div>
          <div className="w-[clamp(170px,40vw,550px)] lg:w-full lg:col-start-3">
            <video autoPlay loop muted playsInline>
              <source src={selectionVid} type="video/mp4" />
            </video>
          </div>
          <div className="lg:col-start-2 lg:row-start-1 lg:w-full lg:flex lg:flex-col lg:content-center">
            <Heading text="Engage in Battle" size="sm" className='mb-4'/>
            <div className="text-justify lg:max-w-full">Once the timer ends, battle begins! Combine skills and items to knock out all 3 enemy monsters. Win to return to exploration and power up your team for the next duel—lose, and it's Game Over!</div>
          </div>
        </div>
      </div>
    </RegularBG>
  );
}