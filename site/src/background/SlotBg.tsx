import imgUL from '../assets/background/slot/green/slotGreenUL.png';
import imgUM from '../assets/background/slot/green/slotGreenUM.png';
import imgUR from '../assets/background/slot/green/slotGreenUR.png';
import imgML from '../assets/background/slot/green/slotGreenML.png';
import imgMM from '../assets/background/slot/green/slotGreenMM.png';
import imgMR from '../assets/background/slot/green/slotGreenMR.png';
import imgBL from '../assets/background/slot/green/slotGreenDL.png';
import imgBM from '../assets/background/slot/green/slotGreenDM.png';
import imgBR from '../assets/background/slot/green/slotGreenDR.png';

const regStyles = {
  '--img-ul': `url(${imgUL})`,
  '--img-um': `url(${imgUM})`,
  '--img-ur': `url(${imgUR})`,
  '--img-ml': `url(${imgML})`,
  '--img-mm': `url(${imgMM})`,
  '--img-mr': `url(${imgMR})`,
  '--img-bl': `url(${imgBL})`,
  '--img-bm': `url(${imgBM})`,
  '--img-br': `url(${imgBR})`,
} as React.CSSProperties;

export default function SlotBg({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid grid-cols-[29px_1fr_29px] grid-rows-[30px_1fr_30px] gap-0' style={regStyles}>
      <div className="bg-(image:--img-ul) bg-no-repeat" />
      <div className="bg-(image:--img-um) bg-[round_no-repeat]" />
      <div className="bg-(image:--img-ur) bg-no-repeat" />
      <div className="bg-(image:--img-ml) bg-[no-repeat_round]" />
      <div className="relative bg-(image:--img-mm) -m-px">
          { children }
      </div>
      <div className="bg-(image:--img-mr) bg-[no-repeat_round]" />
      <div className="bg-(image:--img-bl) bg-no-repeat" />
      <div className="bg-(image:--img-bm) bg-[round_no-repeat]" />
      <div className="bg-(image:--img-br) bg-no-repeat" />
    </div>
  );
}