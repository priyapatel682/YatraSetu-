"use client";

import Link from "next/link";
import { MapPin, Mail, Phone, Heart } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer({ 
  siteName = "YatraSetu",
  supportEmail = "contact@yatrasetu.in",
  supportPhone = "+91 1800-XXX-XXXX",
  address = "New Delhi, India",
  socialFacebook = "https://facebook.com",
  socialInstagram = "https://instagram.com",
  socialWhatsapp = "+919876543210"
}: { 
  siteName?: string,
  supportEmail?: string,
  supportPhone?: string,
  address?: string,
  socialFacebook?: string,
  socialInstagram?: string,
  socialWhatsapp?: string
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/login")) return null;
  
  // Format Whatsapp link
  const whatsappUrl = socialWhatsapp.startsWith("http") 
    ? socialWhatsapp 
    : `https://wa.me/${socialWhatsapp.replace(/[^0-9]/g, "")}`;
  
  return (
    <footer className="bg-surface-900 text-white/80 pt-16 pb-8 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-brand-500 text-white p-2 rounded-full group-hover:bg-brand-600 transition-colors">
                <MapPin size={20} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-brand-300">
                {siteName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              A centralized digital portal providing comprehensive, reliable, and location-based information about temples across India.
            </p>
            <div className="flex space-x-4">
              <a href={socialFacebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E4405F] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 0C5.397 0 0 5.397 0 12.031c0 2.122.553 4.195 1.603 6.012L.031 24l6.104-1.601a12.006 12.006 0 005.896 1.543c6.632 0 12.029-5.396 12.029-12.031C24.06 5.398 18.663 0 12.031 0zm0 21.983c-1.802 0-3.568-.485-5.114-1.402l-.367-.217-3.799.996.996-3.799-.217-.367c-.917-1.546-1.402-3.312-1.402-5.114 0-5.546 4.512-10.058 10.058-10.058 5.548 0 10.058 4.512 10.058 10.058 0 5.547-4.51 10.059-10.058 10.059zm5.52-7.558c-.303-.152-1.792-.885-2.068-.985-.277-.101-.48-.152-.682.152-.202.303-.782.985-.959 1.187-.177.202-.353.227-.656.076-1.282-.641-2.583-1.442-3.662-2.822-.276-.353-.131-.546.02-.698.136-.137.303-.353.454-.531.152-.177.202-.303.303-.505.101-.202.05-.38-.025-.531-.076-.152-.682-1.646-.934-2.253-.245-.59-.496-.511-.682-.52-.177-.009-.38-.009-.583-.009-.202 0-.531.076-.808.38-.277.303-1.06 1.036-1.06 2.527s1.085 2.931 1.237 3.134c.152.202 2.145 3.275 5.198 4.59 1.954.843 2.766.758 3.321.657.63-.114 1.792-.733 2.044-1.441.253-.708.253-1.314.177-1.441-.076-.127-.277-.202-.581-.354z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-brand-400 transition-colors">Home</Link></li>
              <li><Link href="/search" className="hover:text-brand-400 transition-colors">Search Temples</Link></li>
              <li><Link href="/states" className="hover:text-brand-400 transition-colors">Destinations</Link></li>
              <li><Link href="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Popular Circuits</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/search?circuit=chardham" className="hover:text-brand-400 transition-colors">Char Dham Yatra</Link></li>
              <li><Link href="/search?circuit=jyotirlinga" className="hover:text-brand-400 transition-colors">12 Jyotirlingas</Link></li>
              <li><Link href="/search?circuit=shaktipeeth" className="hover:text-brand-400 transition-colors">Shakti Peethas</Link></li>
              <li><Link href="/search?circuit=panchkedar" className="hover:text-brand-400 transition-colors">Panch Kedar</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-500 mt-0.5 shrink-0" size={16} />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-brand-500 shrink-0" size={16} />
                <span>{supportEmail}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-500 shrink-0" size={16} />
                <span>{supportPhone}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart className="text-brand-500" size={14} fill="currentColor" />
            <span>for Indian Heritage</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
