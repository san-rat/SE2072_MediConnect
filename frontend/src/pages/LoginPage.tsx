import { Link } from "react-router-dom"
import { Shield, Bell, Check, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "../components/Header"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showLogin={false} />

      <main className="container-pro py-16">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <div className="mb-12 text-center">
            <h1 className="mc-heading mb-4 text-4xl">Welcome to MediConnect</h1>
            <p className="mc-subheading mx-auto max-w-xl text-lg">
              Choose your access level to continue to the appropriate dashboard.
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Admin */}
            <Card className="bg-card text-card-foreground border border-border shadow-[0_8px_30px_rgba(2,44,55,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(2,44,55,0.08)]">
              <CardHeader className="text-center">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-xl bg-muted text-primary">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Admin Access</CardTitle>
                <CardDescription className="text-base">
                  Hospital staff and administrators can manage patient notifications, create alerts,
                  and oversee the notification system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2 text-sm text-[rgb(31,41,55)]">
                  {[
                    "Send notifications to patients",
                    "Manage appointment reminders",
                    "Create health awareness alerts",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-muted text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="btn btn-primary w-full hover:bg-secondary">
                  <Link to="/admin">
                    <Shield className="mr-2 h-5 w-5" />
                    Access Admin Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Patient */}
            <Card className="bg-card text-card-foreground border border-border shadow-[0_8px_30px_rgba(2,44,55,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(2,44,55,0.08)]">
              <CardHeader className="text-center">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-xl bg-muted text-primary">
                  <Bell className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Patient Access</CardTitle>
                <CardDescription className="text-base">
                  Patients can view notifications, appointment reminders, and important health updates
                  from their healthcare providers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2 text-sm text-[rgb(31,41,55)]">
                  {[
                    "View appointment schedules",
                    "Receive health reminders",
                    "Access medical updates",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-muted text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild variant="outline" className="btn btn-outline w-full">
                  <Link to="/patient">
                    <Bell className="mr-2 h-5 w-5" />
                    Access Patient Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Back link */}
          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-primary focus-visible:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
