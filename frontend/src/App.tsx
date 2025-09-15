import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "./components/ui/sonner"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import AdminPage from "./pages/AdminPage"
import PatientPage from "./pages/PatientPage"
import "./index.css"

function App() {
  return (
    <Router>
      <div className="App bg-white min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/patient" element={<PatientPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App