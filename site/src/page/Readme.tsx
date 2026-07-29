import './Readme.css'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


import readmeFile from '../assets/README.md?raw';
import RegularBG from '../background/RegularBg';

export default function Readme() {

  return (
    <RegularBG>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{readmeFile}</ReactMarkdown>
    </RegularBG>
    
  );
}