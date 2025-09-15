import { Users, Shield, Clock } from "lucide-react";
import Header from "../components/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container-pro py-16">
        {/* Hero */}
        <section className="text-center mb-16">
          <h2 className="mc-heading text-5xl mb-6">
            Stay Connected with Your Healthcare
          </h2>
          <p className="mc-subheading mx-auto max-w-2xl text-lg">
            Streamlined notification management for hospital staff and patients.
            Keep everyone informed about appointments, health updates, and
            critical medical communications.
          </p>
        </section>

        {/* Features */}
        <section className="mx-auto mb-16 max-w-6xl">
          <h3 className="text-center text-3xl font-bold text-foreground mb-12">
            Why Choose MediConnect?
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            <Feature
              icon={<Shield className="h-8 w-8" />}
              title="HIPAA Compliant"
              desc="Secure, encrypted communication that meets healthcare privacy standards."
            />
            <Feature
              icon={<Clock className="h-8 w-8" />}
              title="Real-Time Notifications"
              desc="Instant delivery of critical information and appointment reminders."
            />
            <Feature
              icon={<Users className="h-8 w-8" />}
              title="Easy to Use"
              desc="An intuitive interface for both healthcare professionals and patients."
            />
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto mb-16 max-w-4xl">
          <h3 className="text-center text-3xl font-bold text-foreground mb-12">
            How It Works
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            <Step
              n={1}
              title="Healthcare Staff"
              desc="Create and send notifications from the secure admin dashboard."
            />
            <Step
              n={2}
              title="Instant Delivery"
              desc="Messages are delivered immediately via preferred channels."
            />
            <Step
              n={3}
              title="Patient Access"
              desc="Patients view and manage updates in their dashboard."
            />
          </div>
        </section>

        {/* Trust row */}
        <section className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-muted px-6 py-3 rounded-full text-sm font-medium text-muted-foreground">
            <Users className="h-5 w-5" />
            Trusted by healthcare professionals nationwide
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-4">
            <Stat n="500+" label="Hospitals" />
            <Stat n="50K+" label="Patients" />
            <Stat n="1M+" label="Notifications" />
            <Stat n="99.9%" label="Uptime" />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- tiny helpers (keep UI consistent) ---------- */

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-xl bg-muted text-primary">
      {children}
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="text-center">
      <IconBox>{icon}</IconBox>
      <h4 className="mb-3 text-xl font-bold text-foreground">{title}</h4>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
        {n}
      </div>
      <h4 className="mb-3 text-lg font-bold text-foreground">{title}</h4>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-foreground">{n}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
