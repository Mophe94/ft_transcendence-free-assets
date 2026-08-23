import imgUL from '../assets/background/special/special_UL.png';
import imgUM from '../assets/background/special/special_UM.png';
import imgUR from '../assets/background/special/special_UR.png';
import imgML from '../assets/background/special/special_ML.png';
import imgMM from '../assets/background/special/special_MM.png';
import imgMR from '../assets/background/special/special_MR.png';
import imgBL from '../assets/background/special/special_DL.png';
import imgBM from '../assets/background/special/special_DM.png';
import imgBR from '../assets/background/special/special_DR.png';

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

export default function SpecialBG({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid grid-cols-[54px_1fr_54px] grid-rows-[43px_1fr_43px] gap-0' style={regStyles}>
      <div className="bg-(image:--img-ul) bg-no-repeat" />
      <div className="bg-(image:--img-um) bg-[round_no-repeat]" />
      <div className="bg-(image:--img-ur) bg-no-repeat" />
      <div className="bg-(image:--img-ml) bg-[no-repeat_round]" />
      <div className="relative bg-(image:--img-mm) bg-[round] bg-auto -m-px">
          { children }
      </div>
      <div className="bg-(image:--img-mr) bg-[no-repeat_round]" />
      <div className="bg-(image:--img-bl) bg-no-repeat" />
      <div className="bg-(image:--img-bm) bg-[round_no-repeat]" />
      <div className="bg-(image:--img-br) bg-no-repeat" />
    </div>
  );
}