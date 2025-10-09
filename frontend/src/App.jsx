import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from "./components/Header"
import HomePage from "./components/HomePage"
import PrescriptionsPage from "./components/PrescriptionsPage"
import AppointmentsPage from "./components/AppointmentsPage"
import NotificationsPage from "./components/NotificationsPage"
import ContactPage from "./components/ContactPage"
import AuthModal from "./components/AuthModal"
import AdminLoginModal from "./components/AdminLoginModal"
import AdminDashboard from "./components/AdminDashboard"
import ProfilePage from './pages/ProfilePage';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorAppointmentsPage from './components/DoctorAppointmentsPage';
import DoctorPatientsPage from './components/DoctorPatientsPage';
import DoctorPrescriptionsPage from './components/DoctorPrescriptionsPage';
import DoctorNotificationsPage from './components/DoctorNotificationsPage';
import DoctorProfilePage from './components/DoctorProfilePage';
import useCurrentUser from './hooks/useCurrentUser';
import "./App.css"
import "./index.css"

function AppContent() {
  const [authOpen, setAuthOpen] = useState(false)
  const [adminLoginOpen, setAdminLoginOpen] = useState(false)
  const [initialMode, setInitialMode] = useState("login")
  const [currentPage, setCurrentPage] = useState("home")
  const { user, loadingUser } = useCurrentUser();
  const location = useLocation();

  // Update currentPage based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentPage('home');
    } else if (path === '/prescriptions') {
      setCurrentPage('prescriptions');
    } else if (path === '/appointments') {
      setCurrentPage('appointments');
    } else if (path === '/notifications') {
      setCurrentPage('notifications');
    } else if (path === '/contact') {
      setCurrentPage('contact');
    } else if (path === '/profile') {
      setCurrentPage('profile');
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

    // For authenticated users, show the routes
    return (
      <Routes>
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
        <Route 
          path="/prescriptions" 
          element={
            user?.role === 'DOCTOR' ? 
            <DoctorPrescriptionsPage user={user} /> : 
            <PrescriptionsPage />
          } 
        />
        <Route 
          path="/appointments" 
          element={
            user?.role === 'DOCTOR' ? 
            <DoctorAppointmentsPage user={user} /> : 
            <AppointmentsPage />
          } 
        />
        <Route 
          path="/patients" 
          element={
            user?.role === 'DOCTOR' ? 
            <DoctorPatientsPage user={user} /> : 
            <HomePage />
          } 
        />
        <Route 
          path="/notifications" 
          element={
            user?.role === 'DOCTOR' ? 
            <DoctorNotificationsPage user={user} /> : 
            <NotificationsPage />
          } 
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route 
          path="/profile" 
          element={
            user?.role === 'DOCTOR' ? 
            <DoctorProfilePage user={user} /> : 
            <ProfilePage user={user} />
          } 
        />
        <Route path="/doctor-dashboard" element={<DoctorDashboard user={user} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard user={user} onLogout={() => window.location.reload()} />} />
      </Routes>
    );
  };

  return (
    <div className="app">
      {/* Hide header for doctor and admin pages */}
      {!(user && (user.role === 'DOCTOR' || user.role === 'ADMIN')) && (
        <Header
          onLoginClick={() => { setInitialMode("login"); setAuthOpen(true) }}
          onRegisterClick={() => { setInitialMode("register"); setAuthOpen(true) }}
          onAdminLoginClick={() => setAdminLoginOpen(true)}
          isModalOpen={authOpen}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          user={user}
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