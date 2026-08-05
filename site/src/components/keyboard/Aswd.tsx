import './Aswd.css'
import LetterKey from './LetterKey';

export default function Aswd() {
  return (
    <div className='aswd-grid'>
        <div className='key-up'><LetterKey kkey='W'/></div>
        <div className='key-left'><LetterKey kkey='A'/></div>
        <div className='key-down'><LetterKey kkey='S'/></div>
        <div className='key-right'><LetterKey kkey='D'/></div>
    </div>
  );
}