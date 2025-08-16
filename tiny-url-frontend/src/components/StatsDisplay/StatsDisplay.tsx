import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FaChartBar, FaHistory, FaLink, FaSync } from 'react-icons/fa';
import './StatsDisplay.css';

interface StatsDisplayProps {
  shortCode: string;
  totalClicks: number;
  dailyClicks: number;
  onRefresh: () => void; // Function to call when refresh is clicked
  isLoading: boolean;     // To show a loading state on the button
}

export const StatsDisplay = ({ 
  shortCode, 
  totalClicks, 
  dailyClicks,
  onRefresh,
  isLoading
}: StatsDisplayProps) => {
  const containerRef = useRef(null);
  const totalRef = useRef<HTMLParagraphElement>(null);
  const dailyRef = useRef<HTMLParagraphElement>(null);

  // This GSAP hook will re-run whenever the click counts change, animating the numbers.
  useGSAP(() => {
    gsap.to(totalRef.current, {
      innerText: totalClicks,
      duration: 1,
      snap: { innerText: 1 },
      ease: 'power2.out',
    });

    gsap.to(dailyRef.current, {
      innerText: dailyClicks,
      duration: 1,
      snap: { innerText: 1 },
      ease: 'power2.out',
    });

  }, { scope: containerRef, dependencies: [totalClicks, dailyClicks] });

  // GSAP hook for the initial card entrance animation.
  useGSAP(() => {
     gsap.from('.stat-item', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="stats-container card">
      <div className="stats-header">
        <h3 className="stats-title">Link Analytics</h3>
        <button onClick={onRefresh} disabled={isLoading} className="refresh-btn" aria-label="Refresh stats">
          <FaSync className={isLoading ? 'spinning' : ''} />
        </button>
      </div>
      <div className="stats-grid">
        <div className="stat-item">
          <FaLink className="stat-icon" />
          <p className="stat-label">Short Code</p>
          <p className="stat-value code">{shortCode}</p>
        </div>
        
        <div className="stat-item">
          <FaChartBar className="stat-icon" />
          <p className="stat-label">Total Clicks</p>
          <p ref={totalRef} className="stat-value">0</p>
        </div>
        
        <div className="stat-item">
          <FaHistory className="stat-icon" />
          <p className="stat-label">Clicks (24h)</p>
          <p ref={dailyRef} className="stat-value">0</p>
        </div>
      </div>
    </div>
  );
};