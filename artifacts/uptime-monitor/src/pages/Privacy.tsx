import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export function Privacy() {
  return (
    <div className="min-h-screen bg-[#08090f] text-white">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
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
          <span className="text-sm text-gray-500">Privacy Policy</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: March 27, 2026</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>SkyWatch collects the following information when you use our service:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
              <li><strong className="text-gray-300">Account information</strong> — your email address and name provided at registration.</li>
              <li><strong className="text-gray-300">Monitor configuration</strong> — URLs, check intervals, and notification preferences you configure.</li>
              <li><strong className="text-gray-300">Check results</strong> — response times, status codes, and uptime data collected from your monitored endpoints.</li>
              <li><strong className="text-gray-300">Usage data</strong> — how you interact with our dashboard to improve the product.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use collected data to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
              <li>Perform uptime checks on your configured monitors.</li>
              <li>Send downtime and recovery alerts via your configured notification channels (Discord, etc.).</li>
              <li>Provide uptime reports and analytics on your dashboard.</li>
              <li>Improve and maintain the SkyWatch platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Retention</h2>
            <p>Monitor check results are retained for 90 days on the Free plan and 365 days on Pro and Enterprise plans. You may delete your account and all associated data at any time from the Settings page.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p>SkyWatch uses Supabase for authentication and database infrastructure. Their privacy policy applies to the data stored in their systems. We do not sell your data to any third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
            <p>We use minimal cookies — only those strictly necessary for authentication session management. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Public Status Pages</h2>
            <p>Status pages you configure as public are accessible by anyone with the URL, without authentication. Monitor names and their current statuses will be visible. Ensure the information displayed does not contain sensitive endpoint details you wish to keep private.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us or use the in-app account deletion feature in Settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact</h2>
            <p>For privacy-related questions, contact us at <span className="text-sky-400">privacy@skywatch.app</span>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
