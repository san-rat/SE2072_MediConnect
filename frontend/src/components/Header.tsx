import { Link } from "react-router-dom"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  showLogin?: boolean
}

export default function Header({ showLogin = true }: HeaderProps) {
  return (
    <header className="border-b border-[#D4DFE6] bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <img 
              src="/MediConnectt.png" 
              alt="MediConnect Logo" 
              className="h-18 w-auto"
            />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0B3B4F]">
                MediConnect
              </h1>
              <p className="text-sm text-[#64748B] font-medium">Smart Healthcare Appointment & Awareness System</p>
            </div>
          </Link>
          
          {showLogin && (
            <Link to="/login">
              <Button className="bg-[#0D8FAC] hover:bg-[#075A6B] text-white font-medium">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
