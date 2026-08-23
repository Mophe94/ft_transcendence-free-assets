import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


import readmeFile from '../assets/README.md?raw';
import RegularBG from '../background/RegularBg';

export default function Readme() {

  return (
    <RegularBG>
      <div className="readme-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {readmeFile}
        </ReactMarkdown>
      </div>
    </RegularBG>
  );
}