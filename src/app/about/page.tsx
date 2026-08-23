import { ShieldCheck, Heart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-50 dark:bg-surface-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About YatraSetu</h1>
          <p className="text-xl text-brand-600 font-medium mb-6">Bridging Pilgrims to Authentic Heritage</p>
          <div className="w-24 h-1 bg-brand-500 mx-auto rounded-full"></div>
        </div>

        <div className="glassmorphism p-8 md:p-12 rounded-3xl border border-white/20 card-shadow mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-foreground/80 leading-relaxed text-lg mb-8">
            India is home to thousands of magnificent temples, each carrying centuries of history, unique rituals, and profound spiritual significance. However, finding accurate and consolidated information about them can be challenging. 
            <br /><br />
            <strong>YatraSetu</strong> was built to solve this problem. We aim to be the definitive, centralized digital portal providing comprehensive, reliable, and location-based information about temples across India—free from commercial distractions and respectfully curated.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Verified Information</h3>
              <p className="text-sm text-foreground/70">All data goes through an administrative approval workflow to ensure authenticity.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Culturally Respectful</h3>
              <p className="text-sm text-foreground/70">Designed with reverence, focusing purely on heritage, rituals, and pilgrimage planning.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Community Driven</h3>
              <p className="text-sm text-foreground/70">Built to serve pilgrims, tourists, and researchers to preserve our rich history.</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 p-8 rounded-3xl border border-gray-100 dark:border-white/5 card-shadow">
          <h2 className="text-2xl font-bold text-foreground mb-4">Data Sourcing Disclaimer</h2>
          <p className="text-foreground/80 leading-relaxed text-sm">
            The information provided on YatraSetu is collected from public records, historical archives, and on-ground verified submissions. While our team makes every effort to ensure the accuracy of temple timings, dress codes, and ritual details, these can occasionally change without prior notice due to special events, eclipses, or administrative decisions by the respective temple trusts. We recommend cross-referencing timings before planning long journeys.
          </p>
        </div>
      </div>
    </div>
  );
}
