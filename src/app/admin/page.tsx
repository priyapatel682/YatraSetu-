"use client";

import { Users, Library, CheckCircle, Clock, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [temples, setTemples] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("yatrasetu_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [templesRes, postsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/temples`, { cache: 'no-store' }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts`, { cache: 'no-store' })
        ]);
        
        let templesData = await templesRes.json();
        let postsData = await postsRes.json();

        if (user.role === "contributor") {
          templesData = templesData.filter((t: any) => t.authorId === user.id);
          postsData = postsData.filter((p: any) => p.authorId === user.id);
        }

        setTemples(templesData);
        setPosts(postsData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-64 text-brand-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  // Calculate dynamic stats based on role
  const totalTemples = temples.length;
  const pendingTemples = temples.filter(t => t.status === "pending").length;
  const publishedTemples = temples.filter(t => t.status === "approved").length;

  // Recent Activity mapping
  const recentActivity = temples.slice(0, 5).map((t: any) => ({
    id: t._id || t.id || Math.random().toString(),
    action: "Submitted",
    temple: t.name,
    time: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently",
    status: t.status || "approved"
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isAdmin ? "Admin Dashboard" : "Contributor Dashboard"}
          </h1>
          <p className="text-foreground/60 text-sm mt-1">
            Welcome back {user.name}, here is what is happening today.
          </p>
        </div>
        {!isAdmin && (
          <Link href="/dashboard/temples/new" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
            <Plus size={18} /> New Temple
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 card-shadow">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-500/10">
            <Library className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-foreground/60 text-sm font-medium">{isAdmin ? "Total Temples" : "My Temples"}</p>
            <h3 className="text-2xl font-bold text-foreground">{totalTemples}</h3>
          </div>
        </div>
        
        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 card-shadow">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-500/10">
            <Clock className="text-amber-500" size={24} />
          </div>
          <div>
            <p className="text-foreground/60 text-sm font-medium">{isAdmin ? "Pending Approvals" : "My Pending"}</p>
            <h3 className="text-2xl font-bold text-foreground">{pendingTemples}</h3>
          </div>
        </div>
        
        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 card-shadow">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50 dark:bg-green-500/10">
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <div>
            <p className="text-foreground/60 text-sm font-medium">{isAdmin ? "Total Published" : "My Published"}</p>
            <h3 className="text-2xl font-bold text-foreground">{publishedTemples}</h3>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 card-shadow">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50 dark:bg-purple-500/10">
              <Users className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-foreground/60 text-sm font-medium">Manage Contributors</p>
              <h3 className="text-sm font-bold text-brand-600 mt-1 cursor-pointer">
                <Link href="/dashboard/contributors">View Users →</Link>
              </h3>
            </div>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        {/* Recent Activity */}
        <div className={`${isAdmin ? 'lg:col-span-2' : ''} bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 card-shadow overflow-hidden`}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
            <h2 className="font-bold text-lg text-foreground">{isAdmin ? "Recent Submissions" : "My Recent Submissions"}</h2>
            <Link href="/dashboard/temples" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-foreground/50">
                {isAdmin ? "No temples found." : "You haven't submitted any temples yet. Start by adding one!"}
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-sm text-foreground/60">
                    <th className="px-6 py-3 font-medium">Temple</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentActivity.map((row: any) => (
                    <tr key={row.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5">
                      <td className="px-6 py-4 font-medium text-foreground">{row.temple}</td>
                      <td className="px-6 py-4 text-foreground/50">{row.time}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                          row.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions (Admin Only) */}
        {isAdmin && (
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 card-shadow p-6">
            <h2 className="font-bold text-lg text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/dashboard/approvals" className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all text-left group">
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-brand-600">Review Submissions</h4>
                  <p className="text-xs text-foreground/50 mt-1">{pendingTemples} pending approvals</p>
                </div>
                <span className="text-brand-500">→</span>
              </Link>
              <Link href="/dashboard/temples" className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all text-left group">
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-brand-600">Manage Content</h4>
                  <p className="text-xs text-foreground/50 mt-1">Update temples and posts</p>
                </div>
                <span className="text-brand-500">→</span>
              </Link>
              <Link href="/dashboard/settings" className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all text-left group">
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-brand-600">Site Settings</h4>
                  <p className="text-xs text-foreground/50 mt-1">Configure global variables</p>
                </div>
                <span className="text-brand-500">→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
