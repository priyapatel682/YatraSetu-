"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Library, MapPin, CheckSquare, Settings, LogOut, FileText, Menu, X, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const storedUser = localStorage.getItem("yatrasetu_user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }
  }, [router]);

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

  const handleLogout = () => {
    localStorage.removeItem("yatrasetu_user");
    router.push("/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-900">Loading...</div>;
  }

  // Define nav links based on role
  const allNavLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, roles: ["admin", "contributor"] },
    { href: "/dashboard/temples", label: "Temples", icon: <Library size={20} />, roles: ["admin", "contributor"] },
    { href: "/dashboard/posts", label: "Articles & Posts", icon: <FileText size={20} />, roles: ["admin", "contributor"] },
    { href: "/dashboard/approvals", label: "Approvals", icon: <CheckSquare size={20} />, roles: ["admin"] },
    { href: "/dashboard/contributors", label: "Contributors", icon: <Users size={20} />, roles: ["admin"] },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings size={20} />, roles: ["admin"] },
  ];

  const navLinks = allNavLinks.filter(link => link.roles.includes(user?.role || "contributor"));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-900 flex">
      {/* Desktop Admin Sidebar */}
      <aside className="w-64 bg-white dark:bg-surface-800 border-r border-gray-200 dark:border-white/10 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-brand-500 text-white p-1.5 rounded-full">
              <MapPin size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-800 dark:text-brand-300">
              Yatra<span className="text-brand-500">Dashboard</span>
            </span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/dashboard");
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400" 
                    : "text-foreground/70 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Admin Header */}
        <header className="h-16 bg-white dark:bg-surface-800 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 md:px-6 shrink-0 relative z-40">
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-foreground/80 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-surface-700 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="md:hidden font-bold text-lg text-brand-600 flex items-center gap-2">
              <MapPin size={20} />
              YatraDashboard
            </div>
          </div>
          
          {/* User Profile */}
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-foreground">{user?.name}</div>
              <div className="text-xs text-foreground/50">{user?.email}</div>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <div className="flex-grow p-4 md:p-6 overflow-y-auto">
          {children}
        </div>
      </main>

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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            />
            
            {/* Slide-out Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white dark:bg-surface-800 border-r border-gray-200 dark:border-white/10 z-50 md:hidden shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/10 shrink-0">
                <Link href="/" className="flex items-center gap-2">
                  <div className="bg-brand-500 text-white p-1.5 rounded-full">
                    <MapPin size={18} />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-brand-800 dark:text-brand-300">
                    Yatra<span className="text-brand-500">Dashboard</span>
                  </span>
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-foreground/50 hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/dashboard");
                  return (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-colors ${
                        isActive 
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400" 
                          : "text-foreground/70 hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-200 dark:border-white/10 shrink-0">
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full">
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
