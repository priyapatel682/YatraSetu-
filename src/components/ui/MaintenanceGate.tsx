"use client";

import { usePathname } from "next/navigation";
import { Settings, Wrench } from "lucide-react";

export default function MaintenanceGate({ isEnabled, siteName }: { isEnabled: boolean, siteName: string }) {
  const pathname = usePathname();
  
  if (!isEnabled) return null;
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/login")) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-surface-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center mb-8 relative">
        <Wrench className="text-brand-500 animate-pulse" size={40} />
        <Settings className="text-brand-400 absolute -bottom-2 -right-2 animate-[spin_4s_linear_infinite]" size={24} />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        {siteName} is under maintenance
      </h1>
      
      <p className="text-lg text-foreground/60 max-w-lg mx-auto">
        We are currently performing some scheduled updates to improve your experience. We will be back online shortly. Thank you for your patience!
      </p>
    </div>
  );
}
