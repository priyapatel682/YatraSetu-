"use client";

import Link from "next/link";
import { Search, User, MapPin, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar({ siteName = "YatraSetu" }: { siteName?: string }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/login")) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Temples", href: "/search" },
    { name: "Destinations", href: "/states" },
    { name: "Articles & Posts", href: "/posts" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glassmorphism border-b border-white/20 dark:border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50 relative">
            <div className="bg-brand-500 text-white p-2 rounded-full group-hover:bg-brand-600 transition-colors">
              <MapPin size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-brand-800 dark:text-brand-300">
              {siteName}
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-medium transition-colors ${
                    isActive
                      ? "text-brand-600 font-bold"
                      : "text-foreground/80 hover:text-brand-600"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-4 z-50 relative">
            <Link href="/search" className="p-2 text-foreground/80 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors hidden md:block">
              <Search size={20} />
            </Link>
            <Link href="/login" className="p-2 text-foreground/80 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors hidden md:block">
              <User size={20} />
            </Link>
            
            {/* Mobile Menu Toggle Button */}
            <button 
              className="md:hidden p-2 text-foreground/80 hover:text-brand-600 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white dark:bg-surface-900 border-l border-gray-100 dark:border-white/10 z-50 md:hidden shadow-2xl flex flex-col pt-24 pb-8 px-6 overflow-y-auto"
            >
              <button 
                className="absolute top-5 right-5 p-2 text-foreground/80 hover:text-brand-600 rounded-full hover:bg-brand-50 dark:hover:bg-surface-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
              
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => {
                  const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-lg font-bold border-b border-gray-100 dark:border-white/5 pb-4 transition-colors ${
                        isActive
                          ? "text-brand-600"
                          : "text-foreground/80 hover:text-brand-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 flex flex-col gap-4">
                <Link 
                  href="/search" 
                  className="flex items-center gap-3 w-full p-4 rounded-xl bg-brand-50 dark:bg-surface-800 text-brand-700 dark:text-brand-300 font-bold transition-colors hover:bg-brand-100 dark:hover:bg-surface-700"
                >
                  <Search size={20} />
                  Search Temples
                </Link>
                <Link 
                  href="/login" 
                  className="flex items-center gap-3 w-full p-4 rounded-xl border-2 border-gray-100 dark:border-white/10 text-foreground font-bold transition-colors hover:bg-gray-50 dark:hover:bg-surface-800"
                >
                  <User size={20} className="text-foreground/70" />
                  Login
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
