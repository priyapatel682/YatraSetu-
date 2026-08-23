"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Loader2, AlertCircle, Edit, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ContributorsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("contributor");

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddForm = () => {
    setEditUserId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("contributor");
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (user: User) => {
    setEditUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword(""); // Keep password empty, only update if typed
    setRole(user.role);
    setError("");
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const isEditing = !!editUserId;
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/${editUserId}` 
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users`;
        
      const payload: any = { name, email, role };
      if (password) payload.password = password; // Only send password if entered

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        await fetchUsers();
        setIsFormOpen(false);
      } else {
        const data = await res.json();
        setError(data.error || `Failed to ${isEditing ? "update" : "create"} user`);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/${itemToDelete}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== itemToDelete));
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users size={24} className="text-brand-500" />
            Contributors
          </h1>
          <p className="text-foreground/60 text-sm mt-1">Manage users who can submit content for approval.</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={openAddForm}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-sm"
          >
            <Plus size={18} />
            Add Contributor
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 card-shadow mb-6 animate-in slide-in-from-top-4 fade-in">
          <h3 className="font-bold text-lg mb-4">{editUserId ? "Edit User" : "Create New Contributor"}</h3>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg flex items-start gap-3 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div className="text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 outline-none focus:border-brand-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 outline-none focus:border-brand-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Role</label>
              <select 
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 outline-none focus:border-brand-500 transition-colors"
              >
                <option value="contributor">Contributor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">
                Password {editUserId && <span className="text-xs text-foreground/50">(Leave blank to keep unchanged)</span>}
              </label>
              <input 
                type="password" 
                required={!editUserId}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 outline-none focus:border-brand-500 transition-colors"
                placeholder={editUserId ? "New password..." : "Secret password"}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button 
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                {editUserId ? "Save Changes" : "Create Account"}
              </button>
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-sm text-foreground/60 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{u.name}</td>
                  <td className="px-6 py-4 text-foreground/70">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                      u.role === 'admin' 
                        ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/50">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditForm(u)}
                        className="p-2 text-foreground/50 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" 
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => setItemToDelete(u.id)}
                        className="p-2 text-foreground/50 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/50">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!itemToDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone and will permanently remove their access."
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
