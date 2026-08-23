"use client";

import { useState, Suspense, useEffect, useMemo } from "react";
import { Search, MapPin, Map, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
// @ts-ignore
import IndiaMapRaw from "@svg-maps/india";

const IndiaMap = IndiaMapRaw.default || IndiaMapRaw;
const ALL_STATES = ["All States", ...[...IndiaMap.locations].map((l: any) => l.name).sort()];

const STATE_CITY_MAP: Record<string, string[]> = {
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Andhra Pradesh": ["Tirupati", "Vijayawada", "Srisailam", "Visakhapatnam", "Anantapur"],
  "Arunachal Pradesh": ["Tawang", "Itanagar", "Ziro", "Bomdila", "Pasighat"],
  "Assam": ["Guwahati", "Tezpur", "Jorhat", "Dibrugarh", "Silchar"],
  "Bihar": ["Bodh Gaya", "Patna", "Nalanda", "Rajgir", "Vaishali"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Jagdalpur", "Durg", "Korba"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi", "Old Delhi"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Somnath", "Dwarka", "Ahmedabad", "Ambaji", "Palitana"],
  "Haryana": ["Kurukshetra", "Panchkula", "Gurugram", "Faridabad", "Panipat"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Kangra", "Kullu"],
  "Jammu and Kashmir": ["Katra", "Srinagar", "Jammu", "Anantnag", "Pahalgam"],
  "Jharkhand": ["Deoghar", "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Karnataka": ["Hampi", "Udupi", "Gokarna", "Mysuru", "Bengaluru"],
  "Kerala": ["Thiruvananthapuram", "Sabarimala", "Guruvayur", "Kochi", "Kozhikode"],
  "Ladakh": ["Leh", "Kargil", "Nubra"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy"],
  "Madhya Pradesh": ["Ujjain", "Omkareshwar", "Khajuraho", "Bhopal", "Indore"],
  "Maharashtra": ["Shirdi", "Pandharpur", "Trimbakeshwar", "Pune", "Mumbai"],
  "Manipur": ["Imphal", "Bishnupur", "Thoubal", "Churachandpur", "Kakching"],
  "Meghalaya": ["Shillong", "Cherrapunji", "Tura", "Jowai", "Nongpoh"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Wokha", "Mon"],
  "Odisha": ["Puri", "Bhubaneswar", "Konark", "Cuttack", "Rourkela"],
  "Puducherry": ["Pondicherry", "Auroville", "Karaikal", "Mahe", "Yanam"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Anandpur Sahib"],
  "Rajasthan": ["Pushkar", "Nathdwara", "Jaipur", "Udaipur", "Jodhpur"],
  "Sikkim": ["Gangtok", "Pelling", "Namchi", "Ravangla", "Lachung"],
  "Tamil Nadu": ["Madurai", "Rameswaram", "Kanchipuram", "Thanjavur", "Chennai"],
  "Telangana": ["Hyderabad", "Warangal", "Bhadrachalam", "Yadagirigutta", "Karimnagar"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia"],
  "Uttar Pradesh": ["Varanasi", "Ayodhya", "Mathura", "Prayagraj", "Vrindavan"],
  "Uttarakhand": ["Badrinath", "Kedarnath", "Rishikesh", "Haridwar", "Dehradun"],
  "West Bengal": ["Kolkata", "Mayapur", "Darjeeling", "Siliguri", "Howrah"]
};

// Removed hardcoded ALL_DEITIES
// Remove hardcoded INITIAL_RESULTS
function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedDeities, setSelectedDeities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Most Popular");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Real data state
  const [templesData, setTemplesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from Express backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/temples`)
      .then(res => res.json())
      .then(data => {
        setTemplesData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch temples", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
    const s = searchParams.get("state");
    if (s && ALL_STATES.includes(s)) setSelectedState(s);
  }, [searchParams]);

  // Handle state change (reset city)
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedCity("All Cities");
  };

  const toggleDeity = (deity: string) => {
    setSelectedDeities(prev => 
      prev.includes(deity) 
        ? prev.filter(d => d !== deity) 
        : [...prev, deity]
    );
  };

  // Compute available deities dynamically based on the live temple data
  const dynamicDeities = useMemo(() => {
    const deities = new Set(templesData.map(t => t.deity).filter(Boolean));
    return Array.from(deities).sort();
  }, [templesData]);

  // Real-time filtering logic
  const filteredResults = useMemo(() => {
    let results = templesData.filter(temple => {
      // Query Match
      if (query) {
        const q = query.toLowerCase();
        if (!temple.name.toLowerCase().includes(q) && !temple.location.toLowerCase().includes(q)) {
          return false;
        }
      }
      
      // State Match
      if (selectedState !== "All States" && !temple.location.includes(selectedState)) {
        return false;
      }

      // City Match
      if (selectedCity !== "All Cities" && !temple.location.includes(selectedCity)) {
        return false;
      }

      // Deity Match
      if (selectedDeities.length > 0 && !selectedDeities.includes(temple.deity)) {
        return false;
      }

      return true;
    });

    if (sortBy === "A-Z") {
      results.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (sortBy === "Most Popular") {
      results.sort((a: any, b: any) => (b.isPopular === true ? 1 : 0) - (a.isPopular === true ? 1 : 0));
    }

    return results;
  }, [query, selectedState, selectedCity, selectedDeities, templesData, sortBy]);

  // Reset pagination to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedState, selectedCity, selectedDeities, sortBy]);

  // Pagination Computation
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredResults.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredResults, currentPage]);

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  const availableCities = useMemo(() => {
    if (selectedState === "All States") return ["All Cities"];
    
    // Start with the hardcoded base cities
    const baseCities = STATE_CITY_MAP[selectedState] || [];
    const citySet = new Set<string>(baseCities);
    
    // Add dynamically fetched cities from temples in that state
    templesData.forEach(temple => {
      if (temple.location && temple.location.includes(selectedState)) {
        const parts = temple.location.split(',');
        if (parts.length > 0) {
          const city = parts[0].trim();
          if (city) citySet.add(city);
        }
      }
    });

    return ["All Cities", ...Array.from(citySet).sort()];
  }, [selectedState, templesData]);

  return (
    <div className="min-h-screen bg-brand-50 dark:bg-surface-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Modern Filter Section */}
        <section className="mb-12 space-y-6">
          
          {/* Main Search Bar */}
          <div className="relative flex items-center bg-white dark:bg-surface-800 p-2 rounded-full shadow-lg border border-brand-100 dark:border-white/10 focus-within:ring-4 focus-within:ring-brand-500/20 transition-all">
            <div className="pl-6 pr-3 text-brand-500">
              <Search size={28} />
            </div>
            <input 
              type="text" 
              autoFocus
              placeholder="Search by state, city, deity, or temple name..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow bg-transparent border-none outline-none py-4 px-2 text-foreground placeholder:text-foreground/50 text-xl font-medium w-full"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between glassmorphism p-6 rounded-3xl border border-white/20 card-shadow">
            
            {/* Deity Pill Buttons */}
            <div className="flex-grow">
              <h4 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-3">Filter by Deity</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedDeities([])}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                    selectedDeities.length === 0
                      ? "bg-brand-500 border-brand-500 text-white shadow-md transform scale-105" 
                      : "bg-white/50 dark:bg-surface-800/50 border-brand-200 dark:border-white/10 text-foreground/80 hover:border-brand-400 hover:text-brand-600"
                  }`}
                >
                  All
                </button>
                {dynamicDeities.map(deity => {
                  const isSelected = selectedDeities.includes(deity);
                  return (
                    <button
                      key={deity}
                      onClick={() => toggleDeity(deity)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                        isSelected 
                          ? "bg-brand-500 border-brand-500 text-white shadow-md transform scale-105" 
                          : "bg-white/50 dark:bg-surface-800/50 border-brand-200 dark:border-white/10 text-foreground/80 hover:border-brand-400 hover:text-brand-600"
                      }`}
                    >
                      {deity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-1">
                  <Map size={16} /> State
                </label>
                <select 
                  value={selectedState} 
                  onChange={handleStateChange}
                  className="bg-white dark:bg-surface-800 border border-brand-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-brand-500 min-w-[200px] cursor-pointer"
                >
                  {ALL_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-1">
                  <Building2 size={16} /> City
                </label>
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={availableCities.length === 1}
                  className="bg-white dark:bg-surface-800 border border-brand-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-brand-500 min-w-[180px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

            </div>

          </div>
        </section>

        {/* Results Area */}
        <div className="mb-6 flex justify-between items-center text-foreground/70">
          <span className="font-medium">Found <strong className="text-brand-600">{filteredResults.length}</strong> temples</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border border-white/20 rounded-lg px-3 py-1 outline-none focus:ring-1 focus:ring-brand-500 text-sm">
            <option value="Most Popular">Most Popular</option>
            <option value="A-Z">A-Z</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-20 glassmorphism rounded-3xl border border-white/20">
            <h3 className="text-2xl font-bold text-foreground mb-2">Loading Temples...</h3>
            <p className="text-foreground/70">Connecting to the database.</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-20 glassmorphism rounded-3xl border border-white/20">
            <h3 className="text-2xl font-bold text-foreground mb-2">No temples found</h3>
            <p className="text-foreground/70">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => { setQuery(""); setSelectedState("All States"); setSelectedCity("All Cities"); setSelectedDeities([]); }}
              className="mt-6 px-6 py-2 bg-brand-100 text-brand-700 rounded-full font-medium hover:bg-brand-200 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {paginatedResults.map((temple: any, i: number) => (
                  <motion.div 
                    key={temple.id || i}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group rounded-3xl overflow-hidden glassmorphism border border-white/20 card-shadow transition-all hover:-translate-y-2 hover:shadow-2xl bg-white/50 dark:bg-surface-800/50"
                  >
                    <div 
                      className={`h-56 ${(!temple.coverImage && (!temple.images || temple.images.length === 0)) ? 'bg-brand-500' : ''} dark:bg-surface-800 relative bg-cover bg-center`}
                      style={(temple.coverImage || (temple.images && temple.images.length > 0)) ? { backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${temple.coverImage || temple.images[0]})` } : {}}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <div className="inline-block px-3 py-1 rounded-full text-xs bg-brand-500 text-white font-bold tracking-wide uppercase shadow-md">
                            {temple.deity}
                          </div>
                          {temple.isPopular && (
                            <div className="inline-block px-3 py-1 rounded-full text-xs bg-black/60 backdrop-blur-md text-yellow-400 border border-yellow-500/30 font-bold tracking-wide uppercase shadow-md flex items-center gap-1">
                              ⭐ Popular
                            </div>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-white drop-shadow-md">{temple.name}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-foreground/70 text-sm mb-6 font-medium">
                        <MapPin size={16} className="text-brand-500" />
                        {temple.location}
                      </div>
                      <Link href={`/temples/${temple.name.toLowerCase().replace(/ /g, '-')}`} className="block text-center w-full py-3 bg-brand-50 dark:bg-surface-700 hover:bg-brand-100 dark:hover:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-xl transition-colors font-bold shadow-sm">
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl font-medium border border-brand-200 dark:border-white/10 hover:bg-brand-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
                >
                  Prev
                </button>
                
                {visiblePages.map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-all ${
                      currentPage === page 
                        ? "bg-brand-500 text-white shadow-md transform scale-105" 
                        : "border border-brand-200 dark:border-white/10 hover:bg-brand-50 dark:hover:bg-white/5 text-foreground/80"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl font-medium border border-brand-200 dark:border-white/10 hover:bg-brand-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-50 flex items-center justify-center">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
