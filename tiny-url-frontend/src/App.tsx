import { useState, useRef, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';

// GSAP and Split-Type for advanced animations
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitType from 'split-type';

import { UrlForm } from './components/UrlForm/UrlForm';
import { UrlResult } from './components/UrlResult/UrlResult';
import { StatsDisplay } from './components/StatsDisplay/StatsDisplay';
import './App.css';

// --- CHOOSE YOUR THEME ---
type Theme = "biorhythm" | "nebula" | "blueprint" | "sunburst" | "matrix";
const themeChoice: Theme = 'biorhythm';  // NEW: Deep green & teal "bio-digital" theme.
// const themeChoice: Theme = 'nebula';     // A colorful, cosmic cloud.
// const themeChoice: Theme = 'blueprint';  // A technical, glowing grid.
// const themeChoice: Theme = 'sunburst';   // A warm, energetic radiating pattern.
// const themeChoice: Theme = 'matrix';     // Classic digital rain effect.

// Allow CSS custom properties in style={{ ... }}
interface CSSVariables extends React.CSSProperties {
  [key: `--${string}`]: string | number;
}

function App() {
  const [shortUrl, setShortUrl] = useState('');
  const [stats, setStats] = useState<{
    shortCode: string;
    totalClicks: number;
    dailyClicks: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

  const appRef = useRef(null);

  // --- JSX for Special Backgrounds (Matrix) ---
  const matrixColumns = useMemo(() => {
    if (themeChoice !== 'matrix') return null;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>"{}[];:?';
    return Array.from({ length: 50 }).map((_, i) => {
      const columnText = Array.from({ length: 50 })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('');
      return (
        <div
          key={i}
          className="matrix-column"
          style={{
            left: `${i * 2}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        >
          {columnText}
        </div>
      );
    });
  }, []);

  // All other logic (GSAP, API calls) remains the same.
  useGSAP(() => {
    const title = new SplitType('.title', { types: 'chars' });
    gsap.from(title.chars, {
      opacity: 0,
      y: 30,
      rotateX: -90,
      stagger: 0.04,
      duration: 0.8,
      ease: 'power3.out',
    });
    gsap.from('.subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.5,
    });
    gsap.from('.form-card', {
      opacity: 0,
      y: 50,
      scale: 0.98,
      duration: 0.7,
      ease: 'expo.out',
      delay: 0.8,
    });
    if (shortUrl) {
      gsap.from('.result-section', {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.7,
        ease: 'expo.out',
      });
    }
    if (stats) {
      gsap.from('.stats-section', {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.7,
        ease: 'expo.out',
      });
    }
  }, { scope: appRef, dependencies: [shortUrl, stats] });

  const handleShorten = async (url: string) => {
    setIsLoading(true);
    setStats(null);
    setShortUrl('');
    try {
      const response = await fetch(`${backendUrl}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || 'The server returned an error.');
      }
      const data = await response.json();
      setShortUrl(data.short_url);
      toast.success('URL shortened successfully!');
    } catch (error) {
      console.error('API Error:', error);
      toast.error((error as Error).message || 'Failed to shorten URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStats = async () => {
    if (!shortUrl || isStatsLoading) return;
    const id = shortUrl.split('/').pop();
    if (!id) return;
    setIsStatsLoading(true);
    if (!stats) {
      toast.loading('Fetching stats...');
    }
    try {
      const response = await fetch(`${backendUrl}/stats/${id}`);
      if (!response.ok) throw new Error('Could not retrieve stats.');
      const data = await response.json();
      setStats({
        shortCode: data.short_code,
        totalClicks: data.total_clicks,
        dailyClicks: data.daily_clicks || 0,
      });
      if (!stats) {
        toast.dismiss();
        toast.success('Stats loaded!');
      }
    } catch (error) {
      if (!stats) toast.dismiss();
      toast.error((error as Error).message);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="app" ref={appRef} data-theme={themeChoice}>
      <Toaster position="top-center" />
      <div className={`background ${themeChoice}`} aria-hidden="true">
        {themeChoice === 'matrix' && matrixColumns}
        {themeChoice === 'biorhythm' && (
          <>
            <div
              className="orb"
              style={{
                "--size": "600px",
                "--x": "-20%",
                "--y": "-20%",
                "--hue": "140deg",
                "--speed": "45s",
              } as CSSVariables}
            />
            <div
              className="orb"
              style={{
                "--size": "500px",
                "--x": "60%",
                "--y": "30%",
                "--hue": "190deg",
                "--speed": "40s",
              } as CSSVariables}
            />
            <div
              className="orb"
              style={{
                "--size": "400px",
                "--x": "20%",
                "--y": "80%",
                "--hue": "170deg",
                "--speed": "35s",
              } as CSSVariables}
            />
          </>
        )}
      </div>

      <header className="header">
        <div className="container">
          <h1 className="title">Quantum Link</h1>
          <p className="subtitle">Condense. Share. Analyze.</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <section className="card form-card">
            <UrlForm onSubmit={handleShorten} isLoading={isLoading} />
          </section>

          {shortUrl && (
            <div className="result-section">
              <UrlResult
                shortUrl={shortUrl}
                onCopy={copyToClipboard}
                onAnalyze={handleGetStats}
                isAnalyzing={isStatsLoading}
                hasStats={!!stats}
              />
            </div>
          )}

          {stats && (
            <div className="stats-section">
              <StatsDisplay
                {...stats}
                onRefresh={handleGetStats}
                isLoading={isStatsLoading}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
