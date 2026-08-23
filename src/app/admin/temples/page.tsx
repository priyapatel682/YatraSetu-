"use client";

import { Search, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdminTemplesPage() {
  const [temples, setTemples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTemples = async () => {
    try {
      const stored = localStorage.getItem("yatrasetu_user");
      let currentUser = null;
      if (stored) currentUser = JSON.parse(stored);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/temples`, { cache: 'no-store' });
      let data = await res.json();
      
      if (currentUser?.role === "contributor") {
        data = data.filter((t: any) => t.authorId === currentUser.id);
      }
      
      const mapped = data.map((t: any) => ({
        id: t._id || t.id,
        name: t.name,
        state: t.state || t.location,
        status: t.status || "approved",
        coverImage: t.coverImage,
        images: t.images,
        date: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown"
      }));
      setTemples(mapped);
    } catch (err) {
      console.error("Failed to fetch temples for admin temples page:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/temples/${itemToDelete}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setTemples(prev => prev.filter(t => t.id !== itemToDelete));
      } else {
        alert("Failed to delete temple.");
      }
    } catch (err) {
      console.error("Error deleting temple:", err);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Temples</h1>
          <p className="text-foreground/60 text-sm mt-1">View, edit, or delete temple listings.</p>
        </div>
        <Link href="/dashboard/temples/new" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus size={18} /> Add Temple
        </Link>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 card-shadow overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-white/5">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search temples..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="bg-white dark:bg-surface-900 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 text-sm flex-grow sm:flex-grow-0">
              <option>All States</option>
              <option>Uttar Pradesh</option>
              <option>Tamil Nadu</option>
            </select>
            <select className="bg-white dark:bg-surface-900 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 text-sm flex-grow sm:flex-grow-0">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-foreground/50">Loading temples...</div>
          ) : temples.length === 0 ? (
            <div className="p-8 text-center text-foreground/50">No temples found in the database.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white dark:bg-surface-800 border-b border-gray-100 dark:border-white/10 text-sm text-foreground/60 uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">State</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Last Modified</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {temples.map((temple: any) => (
                  <tr key={temple.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-surface-900 shrink-0 overflow-hidden relative border border-gray-100 dark:border-white/10">
                          {(temple.coverImage || (temple.images && temple.images.length > 0)) ? (
                            <img src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${temple.coverImage || temple.images[0]}`} alt={temple.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-brand-500/20"></div>
                          )}
                        </div>
                        {temple.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground/70">{temple.state}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        temple.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                        temple.status === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {temple.status.charAt(0).toUpperCase() + temple.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/50">{temple.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/temples/${temple.id}/edit`} className="p-2 text-foreground/50 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Edit">
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => setItemToDelete(temple.id)} className="p-2 text-foreground/50 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {temples.length > 0 && (
          <div className="p-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-sm text-foreground/60">
            <span>Showing 1 to {temples.length} of {temples.length} results</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50" disabled>Prev</button>
              <button className="px-3 py-1 bg-brand-50 text-brand-600 font-medium rounded-md">1</button>
              <button className="px-3 py-1 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!itemToDelete}
        title="Delete Temple"
        message="Are you sure you want to delete this temple? This action cannot be undone."
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
