import imgUL from '../assets/background/regular_paper/regular_paper_UL.png';
import imgUM from '../assets/background/regular_paper/regular_paper_UM.png';
import imgUR from '../assets/background/regular_paper/regular_paper_UR.png';
import imgML from '../assets/background/regular_paper/regular_paper_ML.png';
import imgMM from '../assets/background/regular_paper/regular_paper_MM.png';
import imgMR from '../assets/background/regular_paper/regular_paper_MR.png';
import imgBL from '../assets/background/regular_paper/regular_paper_DL.png';
import imgBM from '../assets/background/regular_paper/regular_paper_DM.png';
import imgBR from '../assets/background/regular_paper/regular_paper_DR.png';

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

export default function RegularBG({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid grid-cols-[52px_1fr_52px] grid-rows-[44px_1fr_43px] gap-0' style={regStyles}>
      <div className="bg-(image:--img-ul) bg-no-repeat" />
      <div className="bg-(image:--img-um) bg-[round_no-repeat]" />
      <div className="bg-(image:--img-ur) bg-no-repeat" />
      <div className="bg-(image:--img-ml) bg-[no-repeat_round]" />
      <div className="relative bg-(image:--img-mm)">
          { children }
      </div>
      <div className="bg-(image:--img-mr) bg-[no-repeat_round]" />
      <div className="bg-(image:--img-bl) bg-no-repeat" />
      <div className="bg-(image:--img-bm) bg-[round_no-repeat]" />
      <div className="bg-(image:--img-br) bg-no-repeat" />
    </div>
  );
}