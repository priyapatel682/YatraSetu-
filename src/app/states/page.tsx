import Link from "next/link";
import { MapPin } from "lucide-react";
// @ts-ignore - no types available for this package
import IndiaMapRaw from "@svg-maps/india";
import { svgPathBbox } from "svg-path-bbox";

const IndiaMap = IndiaMapRaw.default || IndiaMapRaw;

export default async function StatesPage() {
  // Fetch temples to get counts per state
  let stateCounts: Record<string, number> = {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/temples`, { cache: "no-store" });
    if (res.ok) {
      const temples = await res.json();
      temples.forEach((t: any) => {
        if (t.state) {
          stateCounts[t.state] = (stateCounts[t.state] || 0) + 1;
        }
      });
    }
  } catch (err) {
    console.error("Failed to fetch temple counts:", err);
  }

  // Sort states alphabetically
  const sortedStates = [...IndiaMap.locations].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-brand-50 dark:bg-surface-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Explore Destinations</h1>
          <p className="text-lg text-foreground/70">
            Browse temples by state and uncover the rich spiritual heritage spread across every corner of India.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-12 gap-x-4 md:gap-x-8">
          {sortedStates.map((state) => {
            let viewBox = "0 0 612 696"; // fallback
            try {
              const [minX, minY, maxX, maxY] = svgPathBbox(state.path);
              const width = maxX - minX;
              const height = maxY - minY;
              // Add 15% padding around the state map so it doesn't touch the edges of the circle
              const paddingX = width * 0.15;
              const paddingY = height * 0.15;
              viewBox = `${minX - paddingX} ${minY - paddingY} ${width + paddingX * 2} ${height + paddingY * 2}`;
            } catch (e) {
              console.error("Error parsing SVG path for", state.name, e);
            }

            const count = stateCounts[state.name] || 0;

            return (
              <Link 
                href={`/search?state=${encodeURIComponent(state.name)}`} 
                key={state.id}
                className="group flex flex-col items-center justify-start text-center"
              >
                <div className="relative">
                  {/* Temple Count Badge */}
                  <div className="absolute top-0 right-0 md:top-1 md:right-1 z-30 bg-brand-600 text-white text-[10px] md:text-xs font-bold w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-300 border-2 border-brand-50 dark:border-surface-900 group-hover:-translate-y-2 transition-transform duration-300">
                    {count}
                  </div>

                  {/* Custom State Map Display in a Circle */}
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-surface-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center p-6 mb-4 group-hover:-translate-y-2 group-hover:shadow-[0_15px_40px_rgb(0,0,0,0.12)] transition-all duration-300 relative overflow-hidden border border-brand-50 dark:border-white/5">

                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-50 to-transparent dark:from-white/5 dark:to-transparent opacity-50 rounded-full pointer-events-none"></div>

                  <svg 
                    viewBox={viewBox} 
                    className="w-full h-full drop-shadow-sm text-brand-300 dark:text-brand-800/80 group-hover:text-brand-400 dark:group-hover:text-brand-600 transition-colors transform group-hover:scale-110 duration-500 relative z-10"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path 
                      d={state.path} 
                      fill="currentColor"
                      className="stroke-brand-500/30 dark:stroke-brand-900/50 stroke-[2px] group-hover:stroke-brand-500 transition-colors"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
                </div>
                
                <h3 className="text-base md:text-lg font-medium text-foreground/90 group-hover:text-brand-600 transition-colors px-2">
                  {state.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
