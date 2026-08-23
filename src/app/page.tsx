"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Map, Sun } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredTemples, setFeaturedTemples] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/temples`)
      .then(res => res.json())
      .then(data => {
        const featured = data.filter((t: any) => t.isFeatured).slice(0, 6);
        setFeaturedTemples(featured);
      })
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-brand-50 dark:bg-surface-900 -z-20"></div>
        <div className="absolute inset-0 opacity-40 dark:opacity-20 -z-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, var(--color-brand-200) 0%, transparent 40%),
                            radial-gradient(circle at 80% 70%, var(--color-brand-300) 0%, transparent 40%)`
        }}></div>

        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 mb-8 border border-brand-200 dark:border-brand-800/50 shadow-sm"
          >
            <Sun size={16} />
            <span className="text-sm font-medium">Discover India&apos;s Spiritual Heritage</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-foreground mb-6 max-w-4xl tracking-tight leading-tight"
          >
            Your Bridge to <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700">Divine Destinations</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/70 mb-12 max-w-2xl"
          >
            Explore verified, comprehensive information about temples, rituals, timings, and routes across India.
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="w-full max-w-2xl relative flex items-center glassmorphism p-2 rounded-full shadow-lg border border-white/50 dark:border-white/10 group focus-within:ring-2 focus-within:ring-brand-400 transition-all"
          >
            <div className="pl-4 pr-2 text-brand-500">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Search by state, city, deity, or temple name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow bg-transparent border-none outline-none py-3 px-2 text-foreground placeholder:text-foreground/50 text-lg w-full"
            />
            <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-full font-medium transition-colors ml-2 shadow-md">
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* Featured Temples */}
      <section className="py-24 bg-white dark:bg-surface-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Temples</h2>
              <p className="text-foreground/70 text-lg">Discover some of the most revered spiritual centers.</p>
            </div>
            <Link href="/search" className="hidden md:flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium group">
              View All 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTemples.length === 0 ? (
              <div className="col-span-full text-center py-12 text-foreground/50">
                No featured temples yet. Check back soon!
              </div>
            ) : (
              featuredTemples.map((temple, i) => (
                <motion.div key={temple._id || i} whileHover={{ y: -10 }} className="group rounded-3xl overflow-hidden glassmorphism card-shadow border border-gray-100 dark:border-white/5 transition-all">
                  <div 
                    className={`h-48 ${(!temple.coverImage && (!temple.images || temple.images.length === 0)) ? 'bg-brand-500' : ''} dark:bg-surface-800 relative bg-cover bg-center`}
                    style={(temple.coverImage || (temple.images && temple.images.length > 0)) ? { backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${temple.coverImage || temple.images[0]})` } : {}}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                      <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{temple.deity}</span>
                      <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{temple.state}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-brand-600 transition-colors">{temple.name}</h3>
                    <div className="flex items-center gap-2 text-foreground/60 mb-4 text-sm font-medium">
                      <MapPin size={16} />
                      <span>{temple.location}</span>
                    </div>
                    <p className="text-foreground/70 text-sm line-clamp-2 mb-6">
                      {temple.description}
                    </p>
                    <Link href={`/temples/${temple.name.toLowerCase().replace(/ /g, '-')}`} className="w-full block text-center py-3 rounded-xl border border-brand-200 text-brand-700 font-bold hover:bg-brand-50 transition-colors dark:border-brand-800 dark:text-brand-400 dark:hover:bg-brand-900/20 shadow-sm">
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="mt-8 md:hidden flex justify-center">
             <Link href="/search" className="flex items-center gap-2 text-brand-600 font-medium">
              View All Temples <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Circuits */}
      <section className="py-24 bg-brand-50 dark:bg-surface-900">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Popular Pilgrimage Circuits</h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto mb-16">Plan your journey across the most revered spiritual routes.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { name: "Char Dham Yatra", count: 4, icon: <Map className="w-8 h-8" />, slug: "char-dham-yatra" },
                 { name: "12 Jyotirlingas", count: 12, icon: <Sun className="w-8 h-8" />, slug: "12-jyotirlingas" },
                 { name: "Shakti Peethas", count: 51, icon: <MapPin className="w-8 h-8" />, slug: "shakti-peethas" },
                 { name: "Panch Kedar", count: 5, icon: <Map className="w-8 h-8" />, slug: "panch-kedar" },
               ].map((circuit, i) => (
                 <Link href={`/circuits/${circuit.slug}`} key={i}>
                   <motion.div whileHover={{ scale: 1.05 }} className="h-full bg-white dark:bg-surface-800 p-8 rounded-3xl card-shadow border border-brand-100 dark:border-white/5 flex flex-col items-center justify-center text-center cursor-pointer group">
                      <div className="text-brand-500 mb-4 bg-brand-50 dark:bg-brand-900/30 p-4 rounded-full group-hover:bg-brand-500 group-hover:text-white transition-colors">
                        {circuit.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-brand-600 transition-colors">{circuit.name}</h3>
                      <p className="text-foreground/50">{circuit.count} Temples</p>
                   </motion.div>
                 </Link>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
