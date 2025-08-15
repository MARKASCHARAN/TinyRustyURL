import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { UrlForm } from './components/UrlForm/UrlForm';
import { UrlResult } from './components/UrlResult/UrlResult';
import { StatsDisplay } from './components/StatsDisplay/StatsDisplay';
import './App.css';

function App() {
  const [shortUrl, setShortUrl] = useState('');
  const [stats, setStats] = useState<{
    shortCode: string;
    totalClicks: number;
    dailyClicks: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

  const handleShorten = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setShortUrl(data.short_url);
      setStats(null);
      toast.success('URL shortened successfully!');
    } catch (error) {
      toast.error('Failed to shorten URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStats = async () => {
    if (!shortUrl) return;
    const id = shortUrl.split('/').pop();
    if (!id) return;

    try {
      const response = await fetch(`${backendUrl}/stats/${id}`);
      const data = await response.json();
      setStats({
        shortCode: data.short_code,
        totalClicks: data.total_clicks,
        dailyClicks: data.daily_clicks || 0,
      });
    } catch (error) {
      toast.error('Failed to get stats');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="app">
      <Toaster position="top-center" />
      <header className="header">
        <h1>Tiny Rusty URL</h1>
        <p>A fast URL shortener built with Rust and React</p>
      </header>

      <main className="main">
        <UrlForm onSubmit={handleShorten} isLoading={isLoading} />
        
        {shortUrl && (
          <>
            <UrlResult shortUrl={shortUrl} onCopy={copyToClipboard} />
            <button 
              onClick={handleGetStats} 
              className="stats-button"
            >
              View Stats
            </button>
          </>
        )}

        {stats && <StatsDisplay {...stats} />}
      </main>
    </div>
  );
}

export default App;