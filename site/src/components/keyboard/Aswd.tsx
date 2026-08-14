import LetterKey from './LetterKey';

export default function Aswd() {
  return (
    <div
      className='grid grid-cols[1fr_1fr_1fr] gap-[0.3rem] h-fit'>
        <div className='col-start-2 row-start-1'><LetterKey kkey='W'/></div>
        <div className='col-start-1 row-start-2'><LetterKey kkey='A'/></div>
        <div className='col-start-2 row-start-2'><LetterKey kkey='S'/></div>
        <div className='col-start-3 row-start-2'><LetterKey kkey='D'/></div>
    </div>
  );
}