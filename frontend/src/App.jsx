import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from "./components/Header"
import HomePage from "./components/HomePage"
import PrescriptionsPage from "./components/PrescriptionsPage"
import MedicalRecordsPage from "./components/MedicalRecordsPage"
import AppointmentsPage from "./components/AppointmentsPage"
import NotificationsPage from "./pages/Notification/NotificationsPage"
import AdminNotificationsPage from "./pages/Notification/AdminNotificationsPage"
import DoctorNotificationsPage from "./components/DoctorNotificationsPage"
import ContactPage from "./components/ContactPage"
import AuthModal from "./components/AuthModal"
import AdminLoginModal from "./components/AdminLoginModal"
import AdminDashboard from "./components/AdminDashboard"
import ProfilePage from './pages/ProfilePage';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorAppointmentsPage from './components/DoctorAppointmentsPage';
import DoctorPatientsPage from './components/DoctorPatientsPage';
import DoctorPrescriptionsPage from './components/DoctorPrescriptionsPage';
import DoctorMedicalRecordsPage from './components/DoctorMedicalRecordsPage';
import DoctorProfilePage from './components/DoctorProfilePage';
import FeedbackPage from './components/FeedbackPage';
import useCurrentUser from './hooks/useCurrentUser';
import HealthTips from './pages/Healthtips';
import "./App.css"
import "./index.css"

function AppContent() {
  const [authOpen, setAuthOpen] = useState(false)
  const [adminLoginOpen, setAdminLoginOpen] = useState(false)
  const [initialMode, setInitialMode] = useState("login")
  const [currentPage, setCurrentPage] = useState("home")
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('mc_dark_mode') === 'true')
  const { user, loadingUser } = useCurrentUser();
  const location = useLocation();

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Dark mode changes are now handled via direct callback from Header

  // Update currentPage based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentPage('home');
    } else if (path === '/prescriptions') {
      setCurrentPage('prescriptions');
    } else if (path === '/medical-records') {
      setCurrentPage('medical-records');
    } else if (path === '/appointments') {
      setCurrentPage('appointments');
    } else if (path === '/notifications') {
      setCurrentPage('notifications');
    } else if (path === '/health-tips') {
        setCurrentPage('health-tips');
    } else if (path === '/contact') {
      setCurrentPage('contact');
    } else if (path === '/profile') {
      setCurrentPage('profile');
    } else if (path === '/feedback') {
      setCurrentPage('feedback');
    } else if (path === '/doctor-dashboard') {
      setCurrentPage('doctor-dashboard');
    } else if (path === '/admin-dashboard') {
      setCurrentPage('admin-dashboard');
    }
  }, [location.pathname]);

  // Helper function to render content based on user role
  const renderContent = () => {
    if (loadingUser) {
      return <div className="loading-container">Loading...</div>;
    }

    if (!user) {
      return <HomePage />;
    }

    // For authenticated users, show role-based routes
    return (
      <Routes>
        {/* Home / Dashboard routes */}
        <Route
          path="/"
          element={
            user.role === 'DOCTOR' ?
              <DoctorDashboard user={user} /> :
              user.role === 'ADMIN' ?
                <AdminDashboard user={user} onLogout={() => window.location.reload()} /> :
                <HomePage />
          }
        />

          {/* Health Tips: patients only */}
          <Route
              path="/health-tips"
              element={
                  user.role === 'PATIENT'
                      ? <HealthTips user={user} />
                      : <HomePage />
              }
          />

        {/* Prescriptions */}
        <Route
          path="/prescriptions"
          element={
            user.role === 'DOCTOR' ?
              <DoctorPrescriptionsPage user={user} /> :
              <PrescriptionsPage />
          }
        />

        {/* Medical Records */}
        <Route
          path="/medical-records"
          element={
            user.role === 'DOCTOR' ?
              <DoctorMedicalRecordsPage user={user} /> :
              <MedicalRecordsPage />
          }
        />

        {/* Appointments */}
        <Route
          path="/appointments"
          element={
            user.role === 'DOCTOR' ?
              <DoctorAppointmentsPage user={user} /> :
              <AppointmentsPage />
          }
        />

        {/* Patients (only for doctors) */}
        <Route
          path="/patients"
          element={
            user.role === 'DOCTOR' ?
              <DoctorPatientsPage user={user} /> :
              <HomePage />
          }
        />

        {/* Notifications (split by role) */}
        <Route
          path="/notifications"
          element={
            user.role === 'DOCTOR' ?
              <DoctorNotificationsPage user={user} /> :
              user.role === 'ADMIN' ?
                <AdminNotificationsPage user={user} /> :
                <NotificationsPage user={user} /> // patient
          }
        />

        {/* Contact */}
        <Route path="/contact" element={<ContactPage />} />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            user.role === 'DOCTOR' ?
              <DoctorProfilePage user={user} /> :
              <ProfilePage user={user} />
          }
        />

        {/* Feedback (patients only) */}
        <Route
          path="/feedback"
          element={
            user.role === 'PATIENT' ?
              <FeedbackPage /> :
              <HomePage />
          }
        />

        {/* Dashboards */}
        <Route path="/doctor-dashboard" element={<DoctorDashboard user={user} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard user={user} onLogout={() => window.location.reload()} />} />
      </Routes>
    );
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      {/* Hide header for doctor and admin views */}
      {!(user && (user.role === 'DOCTOR' || user.role === 'ADMIN')) && (
        <Header
          onLoginClick={() => { setInitialMode("login"); setAuthOpen(true) }}
          onRegisterClick={() => { setInitialMode("register"); setAuthOpen(true) }}
          onAdminLoginClick={() => setAdminLoginOpen(true)}
          isModalOpen={authOpen}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          user={user}
          onDarkModeToggle={(darkMode) => setIsDarkMode(darkMode)}
        />
      )}

      {renderContent()}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={initialMode}
      />

      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setAdminLoginOpen(false);
          window.location.reload();
        }}
      />
    </div>
  )
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    )
}

export default App
