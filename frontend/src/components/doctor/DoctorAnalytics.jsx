import { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/doctor';
import '../DoctorDashboard.css';

const DoctorAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorAPI.getComprehensiveDashboardData();
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!analyticsData) return <div className="info">No analytics data available.</div>;

  const maxAppointments = Math.max(...analyticsData.weeklyTrends.map(d => d.appointments));
  const maxPatients = Math.max(...Object.values(analyticsData.patientDemographics.ageGroups));

  return (
    <div className="doctor-analytics">
      <div className="analytics-header">
        <h3>Practice Analytics</h3>
        <button 
          className="refresh-btn" 
          onClick={fetchAnalyticsData}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
      
      <div className="analytics-grid">
        {/* Weekly Appointment Trends */}
        <div className="chart-container">
          <h4>Weekly Appointment Trends</h4>
          <div className="chart">
            {analyticsData.weeklyTrends.map((data, index) => (
              <div className="chart-bar" key={index}>
                <div className="bar-container">
                  <div 
                    className="bar appointments" 
                    style={{ height: `${(data.appointments / Math.max(maxAppointments, 1)) * 100}%` }}
                    title={`${data.appointments} Appointments`}
                  ></div>
                  <div 
                    className="bar completed" 
                    style={{ height: `${(data.completed / Math.max(maxAppointments, 1)) * 100}%` }}
                    title={`${data.completed} Completed`}
                  ></div>
                </div>
                <span className="bar-label">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item"><span className="legend-color appointments"></span>Appointments</div>
            <div className="legend-item"><span className="legend-color completed"></span>Completed</div>
          </div>
        </div>

        {/* Patient Demographics - Age Groups */}
        <div className="chart-container">
          <h4>Patient Age Distribution</h4>
          <div className="demographics-chart">
            {Object.entries(analyticsData.patientDemographics.ageGroups).map(([ageGroup, count]) => (
              <div className="demographic-item" key={ageGroup}>
                <div className="demographic-header">
                  <span className="age-group">{ageGroup}</span>
                  <span className="count">{count}</span>
                </div>
                <div className="demographic-bar">
                  <div 
                    className="demographic-fill" 
                    style={{ 
                      width: `${(count / Math.max(maxPatients, 1)) * 100}%`,
                      background: `linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Demographics - Gender */}
        <div className="chart-container">
          <h4>Patient Gender Distribution</h4>
          <div className="gender-chart">
            {Object.entries(analyticsData.patientDemographics.genderDistribution).map(([gender, count]) => (
              <div className="gender-item" key={gender}>
                <div className="gender-info">
                  <span className="gender-label">{gender}</span>
                  <span className="gender-count">{count}</span>
                </div>
                <div className="gender-bar">
                  <div 
                    className="gender-fill" 
                    style={{ 
                      width: `${(count / Math.max(analyticsData.patientDemographics.totalPatients, 1)) * 100}%`,
                      background: gender === 'Male' ? '#3b82f6' : gender === 'Female' ? '#ec4899' : '#10b981'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="chart-container">
          <h4>Performance Metrics</h4>
          <div className="performance-grid">
            <div className="perf-card">
              <div className="perf-icon">✅</div>
              <div className="perf-content">
                <span className="perf-value">{analyticsData.performanceMetrics.completionRate}%</span>
                <span className="perf-label">Completion Rate</span>
              </div>
            </div>
            <div className="perf-card">
              <div className="perf-icon">📅</div>
              <div className="perf-content">
                <span className="perf-value">{analyticsData.performanceMetrics.avgAppointmentsPerDay}</span>
                <span className="perf-label">Avg Appointments/Day</span>
              </div>
            </div>
            <div className="perf-card">
              <div className="perf-icon">💊</div>
              <div className="perf-content">
                <span className="perf-value">{analyticsData.performanceMetrics.prescriptionRate}%</span>
                <span className="perf-label">Prescription Rate</span>
              </div>
            </div>
            <div className="perf-card">
              <div className="perf-icon">📋</div>
              <div className="perf-content">
                <span className="perf-value">{analyticsData.performanceMetrics.medicalRecordRate}%</span>
                <span className="perf-label">Record Completion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Patients */}
        <div className="chart-container">
          <h4>Most Frequent Patients</h4>
          <div className="top-patients">
            {analyticsData.patientDemographics.topPatients.map((patient, index) => (
              <div className="patient-item" key={patient.id}>
                <div className="patient-rank">#{index + 1}</div>
                <div className="patient-info">
                  <div className="patient-name">{patient.name}</div>
                  <div className="patient-details">
                    {patient.age} years • {patient.gender} • {patient.totalVisits} visits
                  </div>
                </div>
                <div className="patient-visits">{patient.totalVisits}</div>
              </div>
            ))}
            {analyticsData.patientDemographics.topPatients.length === 0 && (
              <div className="no-data">No patient data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAnalytics;
