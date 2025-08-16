import { useState } from 'react';
import { FaCopy, FaCheck, FaExternalLinkAlt, FaChartLine } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import './UrlResult.css';

interface UrlResultProps {
  shortUrl: string;
  onCopy: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  hasStats: boolean;
}

export const UrlResult = ({ shortUrl, onCopy, onAnalyze, isAnalyzing, hasStats }: UrlResultProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-card card">
      <div className="result-content">
        <p className="result-label">Your Quantum Link is Ready</p>
        <a 
          href={shortUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="short-url-link"
        >
          {shortUrl.replace(/^https?:\/\//, '')}
          <FaExternalLinkAlt />
        </a>
      </div>
      
      {/* Unified action panel with QR Code and all buttons */}
      <div className="action-panel">
        <div className="qr-code-wrapper">
          <QRCodeCanvas
            value={shortUrl}
            size={80}
            bgColor="transparent"
            fgColor="#e6edf3"
            level="Q"
          />
        </div>
        <div className="button-group">
          <button onClick={handleCopy} className={`action-btn copy-btn ${copied ? 'copied' : ''}`}>
            {copied ? <FaCheck /> : <FaCopy />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button onClick={onAnalyze} className="action-btn analyze-btn" disabled={isAnalyzing}>
            <FaChartLine className={isAnalyzing ? 'spinning' : ''} />
            <span>{hasStats ? 'Analyze Again' : 'Analyze'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};