"use client";

import { CheckSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const [templesRes, postsRes, usersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/temples`, { cache: 'no-store' }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts`, { cache: 'no-store' }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users`, { cache: 'no-store' })
      ]);

      const temples = await templesRes.json();
      const posts = await postsRes.json();
      const users = await usersRes.json();

      const userMap: Record<string, string> = {};
      users.forEach((u: any) => { userMap[u.id] = u.name; });

      const pendingTemples = temples
        .filter((t: any) => t.status === "pending")
        .map((t: any) => ({
          id: t._id || t.id,
          title: t.name,
          type: "Temple",
          author: userMap[t.authorId] || "Unknown",
          date: new Date(t.createdAt).toLocaleDateString(),
          endpoint: "temples"
        }));

      const pendingPosts = posts
        .filter((p: any) => p.status === "pending")
        .map((p: any) => ({
          id: p._id || p.id,
          title: p.title,
          type: "Post",
          author: userMap[p.authorId] || "Unknown",
          date: new Date(p.createdAt).toLocaleDateString(),
          endpoint: "posts"
        }));

      setApprovals([...pendingTemples, ...pendingPosts]);
    } catch (err) {
      console.error("Failed to fetch pending items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string, endpoint: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/${endpoint}/${id}/approve`, {
        method: "PUT"
      });
      if (res.ok) {
        setApprovals(prev => prev.filter(a => a.id !== id));
      } else {
        alert("Failed to approve item");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-brand-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content Approvals</h1>
        <p className="text-foreground/60 text-sm mt-1">Review and approve submissions from Contributors before they go live.</p>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-sm text-foreground/60 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Content Title</th>
                <th className="px-6 py-4 font-medium">Submitted By</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {approvals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/50">
                    <CheckSquare size={32} className="mx-auto mb-3 opacity-20" />
                    No pending approvals at this time.
                  </td>
                </tr>
              ) : approvals.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5">
                  <td className="px-6 py-4 font-medium text-foreground">{item.title}</td>
                  <td className="px-6 py-4 text-foreground/70">{item.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.type === 'Temple' 
                        ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' 
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/50">{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/dashboard/${item.endpoint}/${item.id}/edit`} 
                        className="px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        Review
                      </Link>
                      <button 
                        onClick={() => handleApprove(item.id, item.endpoint)}
                        className="px-3 py-1.5 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
