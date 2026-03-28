import { Link } from "wouter";

export function Terms() {
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
          <span className="text-sm text-gray-500">Terms of Service</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-gray-500 text-sm">Last updated: March 27, 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using SkyWatch, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Service Description</h2>
            <p>SkyWatch is an API and web endpoint monitoring platform. We continuously check your configured URLs, measure response times, and send alerts when downtime is detected. We do not guarantee 100% availability of our monitoring infrastructure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
              <li>Monitor endpoints you do not own or have explicit permission to monitor.</li>
              <li>Use SkyWatch to perform denial-of-service attacks.</li>
              <li>Attempt to reverse-engineer or exploit the platform.</li>
              <li>Share account credentials with unauthorized parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Plans & Billing</h2>
            <p>Free plan users are limited to 10 monitors with 60-second check intervals. Pro and Enterprise plans provide higher limits and shorter intervals. Billing is handled monthly; cancellations take effect at the end of the billing period. No refunds are issued for partial periods.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Limitations of Liability</h2>
            <p>SkyWatch is provided "as is." We are not liable for any losses resulting from missed alerts, monitoring failures, or service interruptions. Our maximum liability is limited to the fees paid in the last 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. You may close your account at any time from the Settings page.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Changes to Terms</h2>
            <p>We may update these terms. Continued use of SkyWatch after changes constitutes acceptance of the new terms. We will notify you via email of significant changes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Governing Law</h2>
            <p>These terms are governed by applicable law. Disputes shall be resolved through binding arbitration.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
            <p>For questions about these terms, contact <span className="text-sky-400">legal@skywatch.app</span>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
