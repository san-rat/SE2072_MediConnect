import { useState } from "react"
import Header from "./components/Header"
import HomePage from "./components/HomePage"
import PrescriptionsPage from "./components/PrescriptionsPage"
import AppointmentsPage from "./components/AppointmentsPage"
import NotificationsPage from "./components/NotificationsPage"
import ContactPage from "./components/ContactPage"
import AuthModal from "./components/AuthModal"
import "./App.css"
import "./index.css"

function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [initialMode, setInitialMode] = useState("hero")
  const [currentPage, setCurrentPage] = useState("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "prescriptions":
        return <PrescriptionsPage />
      case "appointments":
        return <AppointmentsPage />
      case "notifications":
        return <NotificationsPage />
      case "contact":
        return <ContactPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="app">
      <Header
        onLoginClick={() => { setInitialMode("login"); setAuthOpen(true) }}
        onRegisterClick={() => { setInitialMode("register"); setAuthOpen(true) }}
        isModalOpen={authOpen}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {renderPage()}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={initialMode}
      />
    </div>
  )
}

export default App