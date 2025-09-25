import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header"
import HomePage from "./components/HomePage"
import PrescriptionsPage from "./components/PrescriptionsPage"
import AppointmentsPage from "./components/AppointmentsPage"
import NotificationsPage from "./components/NotificationsPage"
import ContactPage from "./components/ContactPage"
import AuthModal from "./components/AuthModal"
import ProfilePage from './pages/ProfilePage';
import "./App.css"
import "./index.css"

function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [initialMode, setInitialMode] = useState("hero")
  const [currentPage, setCurrentPage] = useState("home")
  const user = {/* get user from context or state */};

  return (
    <Router>
      <div className="app">
        <Header
          onLoginClick={() => { setInitialMode("login"); setAuthOpen(true) }}
          onRegisterClick={() => { setInitialMode("register"); setAuthOpen(true) }}
          isModalOpen={authOpen}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          user={user}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
        </Routes>

        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          initialMode={initialMode}
        />
      </div>
    </Router>
  )
}

export default App