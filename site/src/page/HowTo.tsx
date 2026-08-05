import RegularBG from '../background/RegularBg';
import './HowTo.css'

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

export default function HowToPlay() {
  return (
    <div className='how-to-container'>
      <RegularBG>
        <div className='howto-content'>
          
          <div className='heading-large'>How to Play</div>
          <div className='howto-intro'>Essential controls & features before starting your adventure.</div>
          
          <div className='instruction right-instruct'>
            <div className='key-action'><Aswd/></div>
            <div className='demo-container'>
              <video className="video-banner" autoPlay loop muted playsInline>
                <source src={moveVid} type="video/mp4" />
              </video>
            </div>
            <div className='paragraph'>
              <div className='heading-small'>Movement</div>
              <div className='descript'>Use WASD to walk around, explore the world, and navigate through the map.</div>
            </div>
          </div>
          <hr/>
          <div className='instruction left-instruct'>
            <div className='key-action'><Key kkey='E'/></div>
            <div className='demo-container'>
              <video className="video-banner" autoPlay loop muted playsInline>
                <source src={interactVid} type="video/mp4" />
              </video>
            </div>
            <div className='paragraph'>
              <div className='heading-small'>Interact</div>
              <div className='descript'>Press E to trigger world elements, activate teleporters, and pick up items found in the world.</div>
            </div>
          </div>
          <hr/>
          <div className='instruction right-instruct'>
            <div className='key-action mouse-click-container'>
              <img src={cursor}/>
              <div>Left Click</div>
            </div>
            <div className='demo-container'>
              <video className="video-banner" autoPlay loop muted playsInline>
                <source src={captureVid} type="video/mp4" />
              </video>
            </div>
            <div className='paragraph'>
              <div className='heading-small'>Capture</div>
              <div className='descript'>Interact with wild creatures to capture them and assemble a party of up to 6 monsters! Beware though: monsters can escape during capture!</div>
            </div>
          </div>
          <hr/>
          <div className='instruction left-instruct'>
            <div className='key-action'><SpaceKey/></div>
            <div className='demo-container'>
              <video className="video-banner" autoPlay loop muted playsInline>
                <source src={inventoryVid} type="video/mp4" />
              </video>
            </div>
            <div className='paragraph'>
                <div className='heading-small'>Inventory</div>
                <div className='descript'>Press Spacebar anytime to open your inventory and manage your collected items.</div>
            </div>
          </div>
          <hr/>         
          <div className='instruction right-instruct'>
            <div className='key-action mouse-click-container'>
              <img src={cursor}/>
              <div>Left Click</div>
            </div>
            <div className='demo-container'>
              <video className="video-banner" autoPlay loop muted playsInline>
                <source src={discardVid} type="video/mp4" />
              </video>
            </div>
            <div className='paragraph'>
              <div className='heading-small'>Discard Item</div>
              <div className='descript'>Left-click on any item inside your inventory to throw it away and free up space.</div>
            </div>
          </div>
          <hr/>          
          <div className='instruction left-instruct'>
            <div className='key-action mouse-click-container'>
              <img src={cursor}/>
              <div>Left Click</div>
            </div>
            <div className='demo-container'>
              <video className="video-banner" autoPlay loop muted playsInline>
                <source src={teamVid} type="video/mp4" />
              </video>
            </div>
            <div className='paragraph'>
                <div className='heading-small'>Battle Preparation</div>
                <div className='descript'>Prepare your lineup before the timer runs out. Out of your 6 captured monsters, carefully select the 3 fighters that will enter the arena!</div>
            </div> 
          </div>
          <hr/>
          <div className='instruction right-instruct'>
            <div className='key-action mouse-click-container'>
              <img src={cursor}/>
              <div>Left Click</div>
            </div>
            <div className='demo-container'>
              <video className="video-banner" autoPlay loop muted playsInline>
                <source src={selectionVid} type="video/mp4" />
              </video>
            </div>
            <div className='paragraph'>
              <div className='heading-small'>Engage in Battle</div>
              <div className='descript'>Once the timer ends, battle begins! Combine skills and items to knock out all 3 enemy monsters. Win to return to exploration and power up your team for the next duel—lose, and it's Game Over!</div>
            </div>          
          </div>
        </div>
      </RegularBG>
    </div>
  );
}