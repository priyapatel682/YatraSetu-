"use client";

import { Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    siteName: "",
    supportEmail: "",
    supportPhone: "",
    address: "",
    socialFacebook: "",
    socialInstagram: "",
    socialWhatsapp: "",
    maintenanceMode: false
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSettings({
          siteName: data.siteName || "",
          supportEmail: data.supportEmail || "",
          supportPhone: data.supportPhone || "",
          address: data.address || "",
          socialFacebook: data.socialFacebook || "",
          socialInstagram: data.socialInstagram || "",
          socialWhatsapp: data.socialWhatsapp || "",
          maintenanceMode: data.maintenanceMode || false
        });
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      });
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Settings saved successfully. The changes will reflect across the site.' });
        // Force router refresh so layouts that fetch data can update
        router.refresh();
      } else {
        setStatus({ type: 'error', message: 'Failed to save settings. Please try again.' });
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setStatus({ type: 'error', message: 'Network error occurred while saving.' });
    } finally {
      setIsSaving(false);
      
      // Auto dismiss success message
      setTimeout(() => {
        setStatus(null);
      }, 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/60 text-sm mt-1">Configure global application settings.</p>
      </div>

      {status && (
        <div className={`p-4 rounded-xl flex items-start gap-3 border ${
          status.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400' 
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
          <div className="font-medium text-sm">{status.message}</div>
        </div>
      )}

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 card-shadow p-6">
        <form className="space-y-8" onSubmit={handleSave}>
          
          {/* General Config */}
          <div>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">General Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  required
                  className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  required
                  placeholder="New Delhi, India"
                  className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
            </div>
          </div>
          
          {/* Contact & Support */}
          <div>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Contact & Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                  required
                  className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Support Phone Number</label>
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
                  required
                  placeholder="+91 1800-XXX-XXXX"
                  className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Facebook URL</label>
                <input
                  type="url"
                  value={settings.socialFacebook}
                  onChange={(e) => setSettings({...settings, socialFacebook: e.target.value})}
                  placeholder="https://facebook.com/..."
                  className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Instagram URL</label>
                <input
                  type="url"
                  value={settings.socialInstagram}
                  onChange={(e) => setSettings({...settings, socialInstagram: e.target.value})}
                  placeholder="https://instagram.com/..."
                  className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.socialWhatsapp}
                  onChange={(e) => setSettings({...settings, socialWhatsapp: e.target.value})}
                  placeholder="+919876543210"
                  className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
            </div>
          </div>
          
          {/* Advanced */}
          <div>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Advanced</h2>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-3">Maintenance Mode</label>
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-surface-900 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                <button 
                  type="button" 
                  onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-white/20'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
                <div>
                  <div className="font-medium text-sm text-foreground">Disable public access temporarily</div>
                  <div className="text-xs text-foreground/60 mt-0.5">When enabled, visitors will see a maintenance screen. Admin portal remains accessible.</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100 dark:border-white/10 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} /> Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
