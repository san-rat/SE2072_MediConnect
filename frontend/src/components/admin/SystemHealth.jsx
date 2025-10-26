import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import './AdminManagement.css';

const SystemHealth = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getSystemHealth();
      setHealthData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch system health');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online':
      case 'Connected':
      case 'Low':
      case 'Normal':
        return 'status-online';
      case 'High':
        return 'status-warning';
      case 'Critical':
      case 'Offline':
      case 'Disconnected':
        return 'status-critical';
      default:
        return 'status-unknown';
    }
  };

  const getLoadColor = (load) => {
    switch (load) {
      case 'Low':
        return '#10b981';
      case 'Normal':
        return '#3b82f6';
      case 'High':
        return '#f59e0b';
      case 'Critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (loading) return <div className="loading">Loading system health...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!healthData) return <div className="error">No system health data available</div>;

  return (
    <div className="system-health">
      <div className="health-header">
        <h3>System Health & Performance</h3>
        <button 
          className="refresh-btn"
          onClick={fetchSystemHealth}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      <div className="health-grid">
        {/* Server Status */}
        <div className="health-card">
          <div className="health-icon">🖥️</div>
          <div className="health-content">
            <h4>Server Status</h4>
            <div className={`health-status ${getStatusColor(healthData.serverStatus)}`}>
              {healthData.serverStatus}
            </div>
            <p>Last checked: {new Date(healthData.lastChecked).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Database Health */}
        <div className="health-card">
          <div className="health-icon">🗄️</div>
          <div className="health-content">
            <h4>Database Health</h4>
            <div className={`health-status ${getStatusColor(healthData.databaseHealth)}`}>
              {healthData.databaseHealth}
            </div>
            <p>Response: {healthData.dbResponseTime}</p>
          </div>
        </div>

        {/* API Performance */}
        <div className="health-card">
          <div className="health-icon">⚡</div>
          <div className="health-content">
            <h4>API Performance</h4>
            <div className="health-metric">
              <span className="metric-value">{healthData.apiResponseTime}</span>
              <span className="metric-label">Response Time</span>
            </div>
            <p>Average response time</p>
          </div>
        </div>

        {/* System Load */}
        <div className="health-card">
          <div className="health-icon">📊</div>
          <div className="health-content">
            <h4>System Load</h4>
            <div className="health-metric">
              <span 
                className="metric-value"
                style={{ color: getLoadColor(healthData.systemLoad) }}
              >
                {healthData.systemLoad}
              </span>
              <span className="metric-label">Load Level</span>
            </div>
            <p>Current system load</p>
          </div>
        </div>

        {/* Uptime */}
        <div className="health-card">
          <div className="health-icon">⏱️</div>
          <div className="health-content">
            <h4>Uptime</h4>
            <div className="health-metric">
              <span className="metric-value">{healthData.uptime}</span>
              <span className="metric-label">Availability</span>
            </div>
            <p>System uptime percentage</p>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="health-card performance-summary">
          <div className="health-icon">📈</div>
          <div className="health-content">
            <h4>Performance Summary</h4>
            <div className="performance-metrics">
              <div className="perf-metric">
                <span className="perf-label">API Response:</span>
                <span className="perf-value">{healthData.apiResponseTime}</span>
              </div>
              <div className="perf-metric">
                <span className="perf-label">DB Response:</span>
                <span className="perf-value">{healthData.dbResponseTime}</span>
              </div>
              <div className="perf-metric">
                <span className="perf-label">Load:</span>
                <span 
                  className="perf-value"
                  style={{ color: getLoadColor(healthData.systemLoad) }}
                >
                  {healthData.systemLoad}
                </span>
              </div>
              {healthData.dataIntegrity && (
                <div className="perf-metric">
                  <span className="perf-label">Data Integrity:</span>
                  <span className="perf-value">{healthData.dataIntegrity}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real Data Metrics */}
        {healthData.totalUsers !== undefined && (
          <div className="health-card real-data-metrics">
            <div className="health-icon">📊</div>
            <div className="health-content">
              <h4>Real System Data</h4>
              <div className="real-data-grid">
                <div className="real-data-item">
                  <span className="real-data-value">{healthData.totalUsers}</span>
                  <span className="real-data-label">Total Users</span>
                </div>
                <div className="real-data-item">
                  <span className="real-data-value">{healthData.totalDoctors}</span>
                  <span className="real-data-label">Total Doctors</span>
                </div>
                <div className="real-data-item">
                  <span className="real-data-value">{healthData.totalTimeSlots}</span>
                  <span className="real-data-label">Time Slots</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealth;
