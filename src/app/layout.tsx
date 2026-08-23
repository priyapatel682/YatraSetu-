import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import MaintenanceGate from "@/components/ui/MaintenanceGate";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

// Fetch settings dynamically for the metadata
export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings`, { next: { revalidate: 60 } });
    if (res.ok) {
      const settings = await res.json();
      return {
        title: `${settings.siteName} | Your Bridge to Temple Heritage`,
        description: "A centralized digital portal providing comprehensive, reliable, and location-based information about temples across India.",
      };
    }
  } catch (err) {
    // Fallback
  }
  
  return {
    title: "YatraSetu | Your Bridge to Temple Heritage",
    description: "A centralized digital portal providing comprehensive, reliable, and location-based information about temples across India.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  let settings = {
    siteName: "YatraSetu",
    supportEmail: "contact@yatrasetu.in",
    supportPhone: "+91 1800-XXX-XXXX",
    address: "New Delhi, India",
    socialFacebook: "https://facebook.com",
    socialInstagram: "https://instagram.com",
    socialWhatsapp: "+919876543210",
    maintenanceMode: false
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings`, { cache: 'no-store' });
    if (res.ok) {
      settings = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch global settings:", err);
  }

  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <MaintenanceGate isEnabled={settings.maintenanceMode} siteName={settings.siteName} />
        <Navbar siteName={settings.siteName} />
        <main className="flex-grow">{children}</main>
        <Footer 
          siteName={settings.siteName} 
          supportEmail={settings.supportEmail}
          supportPhone={settings.supportPhone} 
          address={settings.address}
          socialFacebook={settings.socialFacebook}
          socialInstagram={settings.socialInstagram}
          socialWhatsapp={settings.socialWhatsapp}
        />
      </body>
    </html>
  );
}
