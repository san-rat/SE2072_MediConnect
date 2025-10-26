import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import './AdminManagement.css';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAnalyticsData();
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderAppointmentTrends = () => {
    if (!analyticsData?.appointmentTrends) return null;

    const maxAppointments = Math.max(...analyticsData.appointmentTrends.map(d => d.appointments));
    const maxCompleted = Math.max(...analyticsData.appointmentTrends.map(d => d.completed));

    return (
      <div className="chart-container">
        <h4>Weekly Appointment Trends</h4>
        <div className="chart">
          {analyticsData.appointmentTrends.map((day, index) => (
            <div key={day.day} className="chart-bar">
              <div className="bar-container">
                <div 
                  className="bar appointments"
                  style={{ 
                    height: `${(day.appointments / maxAppointments) * 100}%` 
                  }}
                  title={`${day.appointments} appointments`}
                ></div>
                <div 
                  className="bar completed"
                  style={{ 
                    height: `${(day.completed / maxCompleted) * 100}%` 
                  }}
                  title={`${day.completed} completed`}
                ></div>
              </div>
              <span className="bar-label">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color appointments"></div>
            <span>Total Appointments</span>
          </div>
          <div className="legend-item">
            <div className="legend-color completed"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>
    );
  };

  const renderUserGrowth = () => {
    if (!analyticsData?.userGrowth) return null;

    const maxUsers = Math.max(...analyticsData.userGrowth.map(d => d.users));

    return (
      <div className="chart-container">
        <h4>User Registration Growth</h4>
        <div className="chart">
          {analyticsData.userGrowth.map((month, index) => (
            <div key={month.month} className="chart-bar">
              <div className="bar-container">
                <div 
                  className="bar users"
                  style={{ 
                    height: `${(month.users / maxUsers) * 100}%` 
                  }}
                  title={`${month.users} users (+${month.growth})`}
                ></div>
              </div>
              <span className="bar-label">{month.month}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color users"></div>
            <span>Total Users</span>
          </div>
        </div>
      </div>
    );
  };

  const renderDoctorUtilization = () => {
    if (!analyticsData?.doctorUtilization) return null;

    return (
      <div className="chart-container">
        <h4>Doctor Utilization by Specialization</h4>
        <div className="utilization-chart">
          {analyticsData.doctorUtilization.map((specialization, index) => (
            <div key={specialization.specialization} className="utilization-item">
              <div className="utilization-header">
                <span className="specialization">{specialization.specialization}</span>
                <span className="utilization-percent">{specialization.utilization}%</span>
              </div>
              <div className="utilization-bar">
                <div 
                  className="utilization-fill"
                  style={{ 
                    width: `${specialization.utilization}%`,
                    backgroundColor: specialization.utilization > 80 ? '#10b981' : 
                                   specialization.utilization > 60 ? '#3b82f6' : '#f59e0b'
                  }}
                ></div>
              </div>
              <div className="utilization-details">
                <span>{specialization.appointments} appointments</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPerformanceMetrics = () => {
    if (!analyticsData?.performanceMetrics) return null;

    const { performanceMetrics } = analyticsData;

    return (
      <div className="chart-container">
        <h4>System Performance Metrics</h4>
        <div className="performance-grid">
          <div className="perf-card">
            <div className="perf-icon">⚡</div>
            <div className="perf-content">
              <span className="perf-value">{performanceMetrics.avgResponseTime}ms</span>
              <span className="perf-label">Avg Response Time</span>
            </div>
          </div>
          <div className="perf-card">
            <div className="perf-icon">❌</div>
            <div className="perf-content">
              <span className="perf-value">{performanceMetrics.errorRate.toFixed(1)}%</span>
              <span className="perf-label">Error Rate</span>
            </div>
          </div>
          <div className="perf-card">
            <div className="perf-icon">📊</div>
            <div className="perf-content">
              <span className="perf-value">{performanceMetrics.throughput}</span>
              <span className="perf-label">Requests/min</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!analyticsData) return <div className="error">No analytics data available</div>;

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h3>Charts & Analytics</h3>
        <button 
          className="refresh-btn"
          onClick={fetchAnalytics}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      <div className="analytics-grid">
        {renderAppointmentTrends()}
        {renderUserGrowth()}
        {renderDoctorUtilization()}
        {renderPerformanceMetrics()}
      </div>
    </div>
  );
};

export default Analytics;
