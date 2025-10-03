import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import PrescriptionsPage from "./components/PrescriptionsPage";
import AppointmentsPage from "./components/AppointmentsPage";
import NotificationLanding from "./pages/Notification/NotificationLanding";
import NotificationPagePatient from "./pages/Notification/NotificationPagePatient";
import NotificationPageAdmin from "./pages/Notification/NotificationPageAdmin";
import ContactPage from "./components/ContactPage";
import AuthModal from "./components/AuthModal";
import ProfilePage from "./pages/ProfilePage";
import useCurrentUser from "./hooks/useCurrentUser";
import "./App.css";
import "./index.css";

// ---------------- App Content ----------------
function AppContent() {
    const [authOpen, setAuthOpen] = useState(false);
    const [initialMode, setInitialMode] = useState("login");
    const [currentPage, setCurrentPage] = useState("home");
    const { user } = useCurrentUser();
    const location = useLocation();

    // Update currentPage based on URL
    useEffect(() => {
        const path = location.pathname;
        if (path === "/") setCurrentPage("HomePage");
        else if (path === "/prescriptions") setCurrentPage("prescriptions");
        else if (path === "/appointments") setCurrentPage("appointments");
        else if (path === "/notifications") setCurrentPage("notifications");
        else if (path === "/contact") setCurrentPage("contact");
        else if (path === "/profile") setCurrentPage("profile");
    }, [location.pathname]);

    return (
        <div className="app">
            <Header
                onLoginClick={() => { setInitialMode("login"); setAuthOpen(true); }}
                onRegisterClick={() => { setInitialMode("register"); setAuthOpen(true); }}
                isModalOpen={authOpen}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                user={user}
            />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/prescriptions" element={<PrescriptionsPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/notifications" element={<NotificationLanding />} />
                <Route path="/patient/notifications" element={<NotificationPagePatient />} />
                <Route path="/admin/notifications" element={<NotificationPageAdmin />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/profile" element={<ProfilePage user={user} />} />
            </Routes>

            <AuthModal
                isOpen={authOpen}
                onClose={() => setAuthOpen(false)}
                initialMode={initialMode}
            />

            <Toaster />
        </div>
    );
}

// ---------------- App Wrapper ----------------
function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
