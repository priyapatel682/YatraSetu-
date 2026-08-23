export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-50 dark:bg-surface-900 py-16">
      <div className="container mx-auto px-4 max-w-3xl bg-white dark:bg-surface-800 p-8 md:p-12 rounded-3xl card-shadow border border-gray-100 dark:border-white/5">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>Last updated: August 2026</p>
          
          <h2 className="text-xl font-bold text-foreground mt-8">1. Acceptance of Terms</h2>
          <p>
            By accessing and using YatraSetu, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8">2. Informational Purpose Only</h2>
          <p>
            The content provided on YatraSetu is for informational purposes only. While we strive to provide accurate and up-to-date information regarding temple history, timings, and rituals, YatraSetu is not legally responsible for any discrepancies. Visitors are advised to cross-check timings with official temple authorities before planning visits.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8">3. Intellectual Property</h2>
          <p>
            All content on this website is compiled by the YatraSetu community. Commercial reproduction of this data is prohibited without prior consent.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8">4. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the platform constitutes your acceptance of the new terms.
          </p>
        </div>
      </div>
    </div>
  );
}
