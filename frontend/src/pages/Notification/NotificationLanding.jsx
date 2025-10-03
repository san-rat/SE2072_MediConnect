import React from "react";
import { Link } from "react-router-dom";
import { Shield, Bell, Check, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function NotificationsLanding() {
    return (
        <div className="min-h-screen bg-background text-foreground">

            <main className="container-pro py-16">
                <div className="mx-auto max-w-2xl text-center">
                    {/* Hero */}
                    <div className="mb-12">
                        <h1 className="mc-heading mb-4 text-4xl">Notifications</h1>
                        <p className="mc-subheading mx-auto max-w-xl text-lg">
                            Choose your access type to view notifications and health alerts.
                        </p>
                    </div>

                    {/* Cards for Admin / Patient */}
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Admin */}
                        <Card className="bg-card text-card-foreground border border-border shadow hover:shadow-lg transition-shadow">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-xl bg-muted text-primary">
                                    <Shield className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-2xl">Admin Access</CardTitle>
                                <CardDescription className="text-base">
                                    Manage patient notifications, publish alerts, and oversee the notification system.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="mb-6 space-y-2 text-sm text-[rgb(31,41,55)]">
                                    {[
                                        "View all notifications",
                                        "Mark notifications as read",
                                        "Publish health alerts",
                                    ].map((t) => (
                                        <li key={t} className="flex items-center gap-2">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-muted text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                                            <span>{t}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button asChild className="w-full">
                                    <Link to="/admin/notifications">
                                        <Shield className="mr-2 h-5 w-5" />
                                        Access Admin Notifications
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Patient */}
                        <Card className="bg-card text-card-foreground border border-border shadow hover:shadow-lg transition-shadow">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-xl bg-muted text-primary">
                                    <Bell className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-2xl">Patient Access</CardTitle>
                                <CardDescription className="text-base">
                                    View notifications, appointment reminders, and health alerts from your providers.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="mb-6 space-y-2 text-sm text-[rgb(31,41,55)]">
                                    {[
                                        "View your notifications",
                                        "Check appointment reminders",
                                        "Receive health updates",
                                    ].map((t) => (
                                        <li key={t} className="flex items-center gap-2">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-muted text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                                            <span>{t}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button asChild variant="outline" className="w-full">
                                    <Link to="/patient/notifications">
                                        <Bell className="mr-2 h-5 w-5" />
                                        Access Patient Notifications
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Back to dashboard */}
                    <div className="mt-12 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center text-muted-foreground hover:text-primary focus-visible:underline"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
