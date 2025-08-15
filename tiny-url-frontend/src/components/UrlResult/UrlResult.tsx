import { FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import './UrlResult.css';

interface UrlResultProps {
  shortUrl: string;
  onCopy: () => void;
}

export const UrlResult = ({ shortUrl, onCopy }: UrlResultProps) => {
  return (
    <div className="url-result">
      <div className="result-card">
        <a 
          href={shortUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="short-url"
        >
          <FaExternalLinkAlt className="link-icon" />
          {shortUrl}
        </a>
        <button onClick={onCopy} className="copy-btn">
          <FaCopy /> Copy
        </button>
      </div>
    </div>
  );
};