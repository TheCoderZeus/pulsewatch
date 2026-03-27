import { useState } from "react";
import { Link } from "wouter";
import { HeroAnimation } from "@/components/landing/HeroAnimation";
import { AuthModal } from "@/components/auth/AuthModal";
import { Activity, Zap, Shield, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function LandingPage() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "register" }>({ 
    isOpen: false, mode: "login" 
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <AuthModal 
        isOpen={authModal.isOpen} 
        mode={authModal.mode} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">PulseWatch</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setAuthModal({ isOpen: true, mode: "login" })}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={() => setAuthModal({ isOpen: true, mode: "register" })}
              className="text-sm font-medium px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4">
        {/* Abstract grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Monitoring Reimagined for 2025
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6 tracking-tight">
              Know before your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">users do.</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              High-frequency synthetic monitoring for APIs, websites, and servers. Get alerted in seconds, not minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => setAuthModal({ isOpen: true, mode: "register" })}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                Start Monitoring Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-all border border-border">
                View Demo Status Page
              </button>
            </div>
          </motion.div>

          <HeroAnimation />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Everything you need to sleep well</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built for modern engineering teams who care about reliability and speed.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Sub-minute Checks", desc: "Monitor your endpoints every 30 seconds to catch micro-outages before they escalate." },
              { icon: Globe, title: "Global Network", desc: "Verifications run from multiple geographic regions to prevent false positives." },
              { icon: Shield, title: "Beautiful Status Pages", desc: "Keep your customers informed with branded, customizable public status pages." },
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                key={i} 
                className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Start for free, upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-3xl bg-card border border-border flex flex-col">
              <h3 className="text-xl font-bold mb-2">Hobby</h3>
              <div className="text-4xl font-display font-bold mb-6">$0<span className="text-lg text-muted-foreground font-sans font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                {["5 Monitors", "5-minute check interval", "Email alerts", "30-day data retention"].map(t => (
                  <li key={t} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> {t}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setAuthModal({ isOpen: true, mode: "register" })}
                className="w-full py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-primary/20 to-card border border-primary/30 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-primary/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-display font-bold mb-6">$29<span className="text-lg text-muted-foreground font-sans font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                {["50 Monitors", "1-minute check interval", "SMS, Webhook, Discord alerts", "Public Status Page", "1-year data retention"].map(t => (
                  <li key={t} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> {t}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setAuthModal({ isOpen: true, mode: "register" })}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:shadow-lg transition-all"
              >
                Start 14-day Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl bg-card border border-border flex flex-col">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-display font-bold mb-6">$99<span className="text-lg text-muted-foreground font-sans font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                {["Unlimited Monitors", "30-second check interval", "White-label status pages", "Custom domain", "Priority support"].map(t => (
                  <li key={t} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> {t}
                  </li>
                ))}
              </ul>
              <button 
                className="w-full py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
