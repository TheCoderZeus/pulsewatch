import { Link } from "wouter";
import { Shield, Lock, Eye, Server, RefreshCw, AlertTriangle } from "lucide-react";

function SecurityCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-sky-400" />
        </div>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export function Security() {
  return (
    <div className="min-h-screen bg-[#08090f] text-white">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <path d="M4 22 Q16 4 28 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 23 Q16 11 24 23" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                <path d="M12 24 Q16 17 20 24" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                <circle cx="16" cy="24" r="2" fill="#38bdf8" />
              </svg>
              SkyWatch
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-sm text-gray-500">Security</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 mb-6">
            <Shield className="w-8 h-8 text-sky-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Security at SkyWatch</h1>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            We take the security of your monitoring data seriously. Here's how we protect your account and the systems you depend on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <SecurityCard
            icon={Lock}
            title="Authentication via Supabase"
            description="All accounts are protected by Supabase Auth using industry-standard JWT tokens. Passwords are hashed using bcrypt. We support secure session management with token expiry."
          />
          <SecurityCard
            icon={Eye}
            title="No Credential Storage"
            description="SkyWatch monitors publicly accessible endpoints using HTTP/HTTPS. We never store or require API keys, passwords, or authentication tokens for the services you monitor."
          />
          <SecurityCard
            icon={Server}
            title="Encrypted Data in Transit"
            description="All data transmitted between your browser and our servers is encrypted using TLS 1.3. Our database connections are also encrypted end-to-end."
          />
          <SecurityCard
            icon={RefreshCw}
            title="Continuous Monitoring"
            description="Our monitoring worker runs every 30 seconds. Check results, response times, and incident logs are stored securely per-user with row-level security in PostgreSQL."
          />
          <SecurityCard
            icon={Shield}
            title="Row-Level Security"
            description="Each user's monitors, alerts, and status pages are isolated using Supabase RLS policies. No user can access another user's data."
          />
          <SecurityCard
            icon={AlertTriangle}
            title="Responsible Disclosure"
            description="Found a security issue? We take all reports seriously. Contact our security team and we'll investigate and respond within 72 hours."
          />
        </div>

        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Report a Security Vulnerability</h2>
          <p className="text-gray-500 text-sm mb-4">
            If you discover a security issue, please reach out to us privately. We appreciate responsible disclosure.
          </p>
          <a
            href="mailto:security@skywatch.app"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-medium transition-colors text-sm"
          >
            <Shield className="w-4 h-4" />
            security@skywatch.app
          </a>
        </div>
      </main>
    </div>
  );
}
