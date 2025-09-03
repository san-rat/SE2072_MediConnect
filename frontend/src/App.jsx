import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import HomePage from './components/HomePage'
import AuthModal from './components/AuthModal'

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')

  const handleLoginClick = () => {
    setAuthModalMode('login')
    setIsAuthModalOpen(true)
  }

  const handleRegisterClick = () => {
    setAuthModalMode('register')
    setIsAuthModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <div className="app">
      <Header 
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
      <HomePage />
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={handleCloseModal}
        initialMode={authModalMode}
      />
    </div>
  )
}

export default App
