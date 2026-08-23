import { circuits } from "@/data/circuits";
import { ArrowLeft, MapPin, Map, Clock, Info, Milestone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
// @ts-ignore
import IndiaMapRaw from "@svg-maps/india";

const IndiaMap = IndiaMapRaw.default || IndiaMapRaw;

// Very basic projection to map Lat/Lng to the 612x696 SVG viewbox
const getX = (lng: number) => {
  const minLng = 68.1;
  const maxLng = 97.4;
  return ((lng - minLng) / (maxLng - minLng)) * 612;
};
const getY = (lat: number) => {
  const minLat = 8.0;
  const maxLat = 37.1;
  return 696 - (((lat - minLat) / (maxLat - minLat)) * 696);
};

export default async function CircuitPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const circuit = circuits.find(c => c.slug === resolvedParams.slug);

  if (!circuit) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-50 dark:bg-surface-900 pb-20">
      {/* Hero Cover */}
      <div className={`h-64 md:h-[400px] ${circuit.heroImage} relative w-full overflow-hidden`}>
        <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-300 via-brand-700 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="container mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={20} /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{circuit.name}</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed">
              {circuit.shortDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 md:mt-12 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-8">
          
          <section className="glassmorphism p-8 rounded-3xl border border-white/20 card-shadow">
            <div className="flex items-center gap-3 mb-6">
              <Info className="text-brand-500" size={28} />
              <h2 className="text-2xl font-bold text-foreground">History & Significance</h2>
            </div>
            <p className="text-foreground/80 leading-relaxed text-lg">
              {circuit.history}
            </p>
          </section>

          <section className="glassmorphism p-8 rounded-3xl border border-white/20 card-shadow">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Map className="text-brand-500" size={28} />
                <h2 className="text-2xl font-bold text-foreground">The Temples ({circuit.temples.length})</h2>
              </div>
            </div>

            {/* Circuit Map */}
            <div className="mb-10 bg-brand-50/50 dark:bg-surface-800/50 rounded-2xl p-4 md:p-8 flex justify-center items-center relative overflow-hidden border border-brand-100 dark:border-white/5">
              <div className="w-full max-w-[400px] aspect-[612/696] relative">
                <svg viewBox="0 0 612 696" className="w-full h-full text-brand-200 dark:text-surface-700 drop-shadow-sm">
                  {IndiaMap.locations.map((state: any) => (
                    <path key={state.id} d={state.path} fill="currentColor" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                  ))}
                </svg>
                
                {/* Plot Temples */}
                {circuit.temples.map((temple, i) => {
                  if (!temple.lat || !temple.lng) return null;
                  const x = getX(temple.lng);
                  const y = getY(temple.lat);
                  return (
                    <div 
                      key={i} 
                      className="absolute group z-10"
                      style={{ left: `${(x / 612) * 100}%`, top: `${(y / 696) * 100}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      {/* Marker */}
                      <div className="w-4 h-4 md:w-5 md:h-5 bg-brand-600 border-2 border-white dark:border-surface-900 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-transform group-hover:scale-125 group-hover:bg-brand-500 hover:z-30">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 z-20">
                        {temple.name}
                        <div className="text-[10px] text-gray-300 font-normal">{temple.location}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {circuit.temples.map((temple, i) => (
                <div key={i} className="bg-white/50 dark:bg-surface-800/50 p-5 rounded-2xl border border-gray-100 dark:border-white/10 hover:-translate-y-1 transition-transform card-shadow">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{temple.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-foreground/60 mb-3 font-medium">
                    <MapPin size={14} className="text-brand-500" />
                    {temple.location}
                  </div>
                  <p className="text-sm text-foreground/70 line-clamp-3">
                    {temple.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Journey Guide Roadmap */}
          {circuit.journeyGuide && circuit.journeyGuide.length > 0 && (
            <section className="glassmorphism p-8 rounded-3xl border border-white/20 card-shadow mt-8">
              <div className="flex items-center gap-3 mb-8">
                <Milestone className="text-brand-500" size={28} />
                <h2 className="text-2xl font-bold text-foreground">Journey Guide Roadmap</h2>
              </div>
              
              <div className="relative border-l-2 border-brand-200 dark:border-brand-900/50 ml-4 md:ml-6 space-y-8 pb-4 mt-4">
                {circuit.journeyGuide.map((step, i) => (
                  <div key={i} className="relative pl-8 md:pl-10">
                    {/* Timeline Node */}
                    <div className="absolute -left-[17px] top-1 flex items-center justify-center w-8 h-8 rounded-full bg-brand-50 dark:bg-surface-900 border-2 border-brand-500 shadow-sm z-10">
                      <span className="text-brand-700 dark:text-brand-400 font-bold text-xs">{step.step}</span>
                    </div>
                    
                    {/* Content Card */}
                    <div className="bg-white/60 dark:bg-surface-800/40 p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-brand-300 dark:hover:border-brand-500/30 transition-colors card-shadow group">
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{step.title}</h3>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            <section className="glassmorphism p-6 md:p-8 rounded-3xl border border-white/20 card-shadow">
              <h3 className="text-xl font-bold text-foreground mb-6">Journey Details</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-foreground/50 uppercase tracking-wider font-bold mb-2">Duration</div>
                  <div className="flex items-center gap-3 text-foreground font-medium bg-brand-50 dark:bg-surface-800 p-4 rounded-xl border border-brand-100 dark:border-white/5">
                    <Clock className="text-brand-500" size={20} />
                    {circuit.duration}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-foreground/50 uppercase tracking-wider font-bold mb-2">Best Time to Visit</div>
                  <div className="text-foreground text-sm leading-relaxed bg-brand-50 dark:bg-surface-800 p-4 rounded-xl border border-brand-100 dark:border-white/5">
                    {circuit.bestTimeToVisit}
                  </div>
                </div>
              </div>
            </section>
            
            <Link href="/search" className="flex items-center justify-center gap-2 w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5">
              Explore All Temples <ArrowLeft className="rotate-180" size={20} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
