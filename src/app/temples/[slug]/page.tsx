import { MapPin, Clock, ShieldAlert, Navigation, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
// @ts-ignore - no types available for this package
import IndiaMapRaw from "@svg-maps/india";
import ImageGallery from "@/components/ImageGallery";

const IndiaMap = IndiaMapRaw.default || IndiaMapRaw;

export default async function TempleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Fetch from our new Express Backend
  let temples = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/temples`, { cache: "no-store" });
    temples = await res.json();
  } catch (err) {
    console.error("Failed to fetch temples from backend:", err);
  }

  // Find the matching temple by dynamically generating a slug from the name
  const templeData = temples.find((t: any) => t.name.toLowerCase().replace(/ /g, '-') === resolvedParams.slug);

  if (!templeData) {
    return (
      <div className="min-h-screen bg-brand-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Temple Not Found</h1>
          <p className="text-foreground/70">We couldn't find the temple you're looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 dark:bg-surface-900 pb-20">
      {/* Hero Cover */}
      <div 
        className="h-64 md:h-96 relative w-full overflow-hidden bg-brand-700"
      >
        {/* Hero Image */}
        {(templeData.coverImage || (templeData.images && templeData.images.length > 0)) && (
          <img 
            src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${templeData.coverImage || templeData.images[0]}`} 
            alt={templeData.name} 
            className="absolute inset-0 w-full h-full object-cover object-center z-0" 
          />
        )}
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
        
        {/* Back Button Overlay */}
        <div className="absolute top-0 left-0 w-full p-6 md:p-12 z-20 pointer-events-none">
          <div className="container mx-auto pointer-events-auto">
            <Link href="/search" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium group bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-white/10">
              <div className="flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <ArrowLeft size={16} />
              </div>
              Back to Explore
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10">
          <div className="container mx-auto">
            <div className="flex gap-2 mb-4">
              <span className="bg-brand-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{templeData.deity}</span>
              <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{templeData.state}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2 drop-shadow-md">{templeData.name}</h1>
            <div className="flex items-center gap-2 text-white/80 text-lg">
              <MapPin size={20} />
              <span>{templeData.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 md:mt-12 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-8">
          
          <section className="glassmorphism p-8 rounded-3xl border border-white/20 card-shadow">
            <h2 className="text-2xl font-bold text-foreground mb-4">History & Significance</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
              {templeData.description}
            </p>
          </section>

          <ImageGallery images={templeData.coverImage ? templeData.images : (templeData.images?.slice(1) || [])} />



          {/* Mobile/Tablet only: Darshan Timings */}
          {templeData.timings && templeData.timings.length > 0 && (
            <section className="glassmorphism p-8 rounded-3xl border border-white/20 card-shadow block lg:hidden">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-brand-500" size={28} />
                <h2 className="text-2xl font-bold text-foreground">Darshan Timings</h2>
              </div>
              <ul className="space-y-4 text-foreground/80 text-base">
                {templeData.timings.map((timing: string, i: number) => {
                  const hasTitle = /^[^:]*[a-zA-Z][^:]*:/.test(timing);
                  if (hasTitle) {
                    const parts = timing.split(':');
                    return (
                      <li key={i} className="flex justify-between border-b border-foreground/10 pb-3 last:border-0 last:pb-0">
                        <span>{parts[0]}</span>
                        <span className="font-medium text-brand-700">{parts.slice(1).join(':').trim()}</span>
                      </li>
                    );
                  }
                  return (
                    <li key={i} className="flex justify-end border-b border-foreground/10 pb-3 last:border-0 last:pb-0">
                      <span className="font-medium text-brand-700">{timing}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {templeData.rituals && templeData.rituals.length > 0 && (
            <section className="glassmorphism p-8 rounded-3xl border border-white/20 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-brand-500" size={28} />
                <h2 className="text-2xl font-bold text-foreground">Rituals & Festivals</h2>
              </div>
              <div className="space-y-4">
                {templeData.rituals.map((ritual: string, i: number) => {
                  const parts = ritual.split(':');
                  const title = parts[0];
                  const desc = parts.slice(1).join(':').trim() || '';
                  return (
                    <div key={i} className="border-l-4 border-brand-400 pl-4 py-1">
                      <h3 className="font-bold text-lg text-foreground">{title}</h3>
                      {desc && <p className="text-foreground/70 text-sm">{desc}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Location & Directions */}
          {(templeData.lat && templeData.lng) ? (
            <section className="glassmorphism p-8 rounded-3xl border border-white/20 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-brand-500" size={28} />
                <h2 className="text-2xl font-bold text-foreground">Location & Directions</h2>
              </div>
              
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-brand-100 dark:border-white/10 mb-8 bg-gray-100">
                 <iframe 
                   src={`https://maps.google.com/maps?q=${templeData.lat},${templeData.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                   width="100%" 
                   height="100%" 
                   style={{ border: 0 }} 
                   allowFullScreen 
                   loading="lazy"
                   title={`${templeData.name} Map Location`}
                 ></iframe>
              </div>
  
              <div className="bg-brand-50 dark:bg-surface-800 p-6 rounded-2xl border border-brand-100 dark:border-white/5">
                <h3 className="text-lg font-bold text-foreground mb-2">Plan Your Journey</h3>
                <p className="text-foreground/70 text-sm mb-6">Enter your starting location to get the best route to the temple.</p>
                
                <form action="https://www.google.com/maps/dir/" target="_blank" method="GET" className="flex flex-col sm:flex-row gap-3">
                  <input type="hidden" name="api" value="1" />
                  <input type="hidden" name="destination" value={`${templeData.lat},${templeData.lng}`} />
                  
                  <div className="flex-grow relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brand-500">
                      <Navigation size={18} />
                    </div>
                    <input 
                      type="text" 
                      name="origin"
                      required
                      placeholder="E.g., New Delhi Railway Station" 
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-foreground"
                    />
                  </div>
                  <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm whitespace-nowrap">
                    Get Directions
                  </button>
                </form>
              </div>
            </section>
          ) : null}

        </div>

        {/* Sidebar Info */}
        <aside className="lg:w-1/3 space-y-6">
          
          {/* Desktop only: Darshan Timings */}
          {templeData.timings && templeData.timings.length > 0 && (
            <div className="glassmorphism p-6 rounded-3xl border border-white/20 card-shadow hidden lg:block">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-brand-500" size={24} />
                <h3 className="text-xl font-bold text-foreground">Darshan Timings</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 text-sm">
                {templeData.timings.map((timing: string, i: number) => {
                  const hasTitle = /^[^:]*[a-zA-Z][^:]*:/.test(timing);
                  if (hasTitle) {
                    const parts = timing.split(':');
                    return (
                      <li key={i} className="flex justify-between border-b border-foreground/10 pb-2 last:border-0 last:pb-0">
                        <span>{parts[0]}</span>
                        <span className="font-medium text-brand-700">{parts.slice(1).join(':').trim()}</span>
                      </li>
                    );
                  }
                  return (
                    <li key={i} className="flex justify-end border-b border-foreground/10 pb-2 last:border-0 last:pb-0">
                      <span className="font-medium text-brand-700">{timing}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Regional Location Map */}
          {templeData.lat && templeData.lng && (
            <div className="glassmorphism p-6 rounded-3xl border border-white/20 card-shadow overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-brand-500" size={24} />
                <h3 className="text-xl font-bold text-foreground">Regional Location</h3>
              </div>
              <p className="text-sm text-foreground/70 mb-6">Temple position across India.</p>
              
              <div className="relative w-full aspect-[612/696] bg-brand-50/30 rounded-2xl flex items-center justify-center p-4">
                 <svg viewBox={IndiaMap.viewBox} className="w-full h-full drop-shadow-md" preserveAspectRatio="xMidYMid meet" aria-label="Map of India">
                   {IndiaMap.locations.map((location: any) => (
                     <path 
                       key={location.id}
                       id={location.id}
                       data-name={location.name}
                       d={location.path}
                       fill="currentColor" 
                       className="text-brand-200 dark:text-surface-800 hover:text-brand-300 dark:hover:text-brand-700 transition-colors stroke-white dark:stroke-surface-900 stroke-[1.5px]"
                     >
                       <title>{location.name}</title>
                     </path>
                   ))}
                   
                   <g className="animate-pulse">
                     <circle 
                        cx={ ((templeData.lng - 68.0) / (97.25 - 68.0)) * 612 }
                        cy={ ((37.6 - templeData.lat) / (37.6 - 6.75)) * 696 }
                        r="16"
                        className="fill-red-500/40"
                     />
                     <circle 
                        cx={ ((templeData.lng - 68.0) / (97.25 - 68.0)) * 612 }
                        cy={ ((37.6 - templeData.lat) / (37.6 - 6.75)) * 696 }
                        r="6"
                        className="fill-red-600 stroke-white stroke-[2px]"
                     />
                   </g>
                 </svg>
              </div>
            </div>
          )}

          {/* Facilities */}
          {templeData.facilities && (templeData.facilities.transport || templeData.facilities.stay) && (
            <div className="glassmorphism p-6 rounded-3xl border border-white/20 card-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Navigation className="text-brand-500" size={24} />
                <h3 className="text-xl font-bold text-foreground">Nearby Facilities</h3>
              </div>
              <ul className="space-y-3 text-sm text-foreground/80">
                {templeData.facilities.transport && (
                  <li><strong className="text-foreground">Transport:</strong> {templeData.facilities.transport}</li>
                )}
                {templeData.facilities.stay && (
                  <li><strong className="text-foreground">Stay:</strong> {templeData.facilities.stay}</li>
                )}
              </ul>
            </div>
          )}

          {/* Guidelines */}
          {templeData.guidelines && (templeData.guidelines.dressCode || templeData.guidelines.otherRules) && (
            <div className="glassmorphism p-6 rounded-3xl border border-brand-200 bg-brand-50/50 card-shadow">
              <div className="flex items-center gap-3 mb-4 text-brand-800">
                <ShieldAlert size={24} />
                <h3 className="text-xl font-bold">Guidelines & Dress Code</h3>
              </div>
              <p className="text-brand-900/80 text-sm leading-relaxed mb-4">
                {templeData.guidelines.dressCode && <span className="block mb-2"><strong>Dress Code:</strong> {templeData.guidelines.dressCode}</span>}
                {templeData.guidelines.otherRules && <span className="block"><strong>Other Rules:</strong> {templeData.guidelines.otherRules}</span>}
              </p>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}
