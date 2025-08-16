import { useState } from 'react';
import { FaLink } from 'react-icons/fa';
import './UrlForm.css';

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const UrlForm = ({ onSubmit, isLoading }: UrlFormProps) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a URL to shorten.');
      return;
    }
    if (!url.includes('.') || !url.startsWith('http')) {
        setError('Please enter a valid URL (e.g., https://example.com).');
        return;
    }
    setError('');
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="url-form" noValidate>
      <div className={`input-group ${error ? 'has-error' : ''}`}>
        <FaLink className="input-icon" aria-hidden="true" />
        <input
          id="long-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          // --- NEW, SMARTER PLACEHOLDER ---
          placeholder="Paste your long, complex, or ugly URL here"
          className="url-input"
          required
          autoFocus
          aria-invalid={!!error}
          aria-describedby="form-description"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading || !url}
        >
          {isLoading ? (
            <span className="spinner" aria-label="Loading" />
          ) : (
            'Shorten'
          )}
        </button>
      </div>
      
      {/* --- NEW DESCRIPTIVE TEXT --- */}
      <p id="form-description" className="form-description">
        <b>Tiny, but smart.</b> Create clean, powerful links complete with QR codes and click analytics.
      </p>

      {error && <p id="url-error" className="error-message">{error}</p>}
    </form>
  );
};