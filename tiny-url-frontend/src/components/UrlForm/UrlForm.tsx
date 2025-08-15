import { useState } from 'react';
import { FaLink } from 'react-icons/fa';
import './UrlForm.css';

interface UrlFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

export const UrlForm = ({ onSubmit, isLoading }: UrlFormProps) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    try {
      await onSubmit(url);
      setError('');
    } catch (err) {
      setError('Failed to shorten URL');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="url-form">
      <div className="input-group">
        <FaLink className="input-icon" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your long URL"
          className="url-input"
          required
        />
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            'Shorten'
          )}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};