import { FaChartBar, FaHistory, FaLink } from 'react-icons/fa';
import './StatsDisplay.css';

interface StatsDisplayProps {
  shortCode: string;
  totalClicks: number;
  dailyClicks: number;
}

export const StatsDisplay = ({ 
  shortCode, 
  totalClicks, 
  dailyClicks 
}: StatsDisplayProps) => {
  return (
    <div className="stats-container">
      <h3 className="stats-title">
        <FaChartBar /> URL Statistics
      </h3>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon">
            <FaLink />
          </div>
          <div className="stat-content">
            <p className="stat-label">Short Code</p>
            <p className="stat-value">{shortCode}</p>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Clicks</p>
            <p className="stat-value">{totalClicks}</p>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">
            <FaHistory />
          </div>
          <div className="stat-content">
            <p className="stat-label">Daily Clicks</p>
            <p className="stat-value">{dailyClicks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};