export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-50 dark:bg-surface-900 py-16">
      <div className="container mx-auto px-4 max-w-3xl bg-white dark:bg-surface-800 p-8 md:p-12 rounded-3xl card-shadow border border-gray-100 dark:border-white/5">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>Last updated: August 2026</p>
          
          <h2 className="text-xl font-bold text-foreground mt-8">1. Information We Collect</h2>
          <p>
            YatraSetu is designed as a public repository of temple information. We do not require users to create an account to browse the platform. We may collect anonymous usage data (like pages visited and search queries) to improve the user experience.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8">2. Admin Accounts</h2>
          <p>
            Users who are granted administrative or contributor access must provide an email address. This information is used strictly for authentication and tracking content submissions to maintain data integrity.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8">3. Cookies</h2>
          <p>
            We use standard functional cookies to remember your preferences (such as dark mode settings). We do not use aggressive tracking or third-party advertising cookies.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8">4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at contact@yatrasetu.in.
          </p>
        </div>
      </div>
    </div>
  );
}
