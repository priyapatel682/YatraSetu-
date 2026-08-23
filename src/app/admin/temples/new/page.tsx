"use client";

import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// @ts-ignore
import IndiaMapRaw from "@svg-maps/india";

const IndiaMap = IndiaMapRaw.default || IndiaMapRaw;
const ALL_STATES = [...IndiaMap.locations].map((l: any) => l.name).sort();

export default function NewTemplePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const submitData = new FormData();
    
    submitData.append("name", formData.get("name") as string);
    submitData.append("state", formData.get("state") as string);
    submitData.append("location", `${formData.get("city")}, ${formData.get("state")}`);
    submitData.append("deity", formData.get("deity") as string);
    submitData.append("description", formData.get("description") as string);
    submitData.append("lat", formData.get("lat") as string);
    submitData.append("lng", formData.get("lng") as string);
    // Read user from localStorage
    let authorId = "admin1";
    let status = "approved";
    
    try {
      const stored = localStorage.getItem("yatrasetu_user");
      if (stored) {
        const user = JSON.parse(stored);
        authorId = user.id;
        if (user.role === "contributor") {
          status = "pending";
        }
      }
    } catch(e) {}

    submitData.append("authorId", authorId);
    submitData.append("status", status);
    submitData.append("isFeatured", formData.get("isFeatured") === "on" ? "true" : "false");
    submitData.append("isPopular", formData.get("isPopular") === "on" ? "true" : "false");

    // Complex nested data as JSON strings for the backend to parse
    submitData.append("rituals", JSON.stringify((formData.get("rituals") as string).split('\n').map(s => s.trim()).filter(Boolean)));
    submitData.append("timings", JSON.stringify((formData.get("timings") as string).split('\n').map(s => s.trim()).filter(Boolean)));
    submitData.append("facilities", JSON.stringify({
      transport: formData.get("transport"),
      stay: formData.get("stay")
    }));
    submitData.append("guidelines", JSON.stringify({
      dressCode: formData.get("dressCode"),
      otherRules: formData.get("otherRules")
    }));

    // Attach Cover Image
    const coverInput = form.querySelector('input[name="coverImage"]') as HTMLInputElement;
    if (coverInput && coverInput.files && coverInput.files[0]) {
      submitData.append("coverImage", coverInput.files[0]);
    }

    // Attach Gallery Images
    const fileInput = form.querySelector('input[name="images"]') as HTMLInputElement;
    if (fileInput && fileInput.files) {
      Array.from(fileInput.files).forEach(file => {
        submitData.append("images", file);
      });
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/temples`, {
        method: "POST",
        body: submitData
      });

      if (!res.ok) {
        throw new Error("Failed to save temple");
      }

      if (previewImage) URL.revokeObjectURL(previewImage);
      window.location.href = "/dashboard/temples"; // Redirect on success
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Temple</h1>
          <p className="text-foreground/60 text-sm mt-1">Submit a new temple to the database.</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 card-shadow overflow-hidden">
        
        <div className="p-6 md:p-8 space-y-10">
          
          <section>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground/80 mb-2">Temple Name *</label>
                <input required name="name" type="text" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Kashi Vishwanath" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">State *</label>
                <select required name="state" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none">
                  <option value="">Select State</option>
                  {ALL_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">City *</label>
                <input required name="city" type="text" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Varanasi" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground/80 mb-2">Primary Deity *</label>
                <input required name="deity" type="text" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Shiva" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 bg-brand-50/50 dark:bg-brand-900/20 p-4 rounded-xl border border-brand-100 dark:border-brand-800/30">
              <input type="checkbox" name="isFeatured" id="isFeatured" className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
              <label htmlFor="isFeatured" className="text-sm font-medium text-foreground">
                Add to Featured Temples (Show on Home Page)
              </label>
            </div>
            
            <div className="mt-3 flex items-center gap-3 bg-brand-50/50 dark:bg-brand-900/20 p-4 rounded-xl border border-brand-100 dark:border-brand-800/30">
              <input type="checkbox" name="isPopular" id="isPopular" className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
              <label htmlFor="isPopular" className="text-sm font-medium text-foreground">
                Mark as Popular (Add Popular badge and boost in search)
              </label>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Map Coordinates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Latitude *</label>
                <input required name="lat" type="number" step="any" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. 25.3109" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Longitude *</label>
                <input required name="lng" type="number" step="any" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. 83.0107" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Details & History</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">History & Significance *</label>
                <textarea required name="description" rows={5} className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Write about the history and significance of the temple..."></textarea>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Rituals & Timings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Rituals & Festivals (One per line)</label>
                <textarea name="rituals" rows={4} className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Mahashivratri: Grandest festival&#10;Mangala Aarti: Early morning ritual"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Darshan Timings (One per line)</label>
                <textarea name="timings" rows={4} className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Mangala Aarti: 3:00 AM - 4:00 AM&#10;General Darshan: 4:00 AM - 11:00 AM"></textarea>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Facilities & Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Nearby Transport</label>
                <input name="transport" type="text" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Varanasi Cantt Railway Station (5km)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Nearby Stay</label>
                <input name="stay" type="text" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Dharamshalas within 1km radius" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Dress Code</label>
                <input name="dressCode" type="text" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Traditional Indian wear is mandatory." />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Other Rules</label>
                <input name="otherRules" type="text" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Leather items, mobile phones are strictly prohibited." />
              </div>
            </div>
          </section>

          {/* Cover Image Upload */}
          <section>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Media & Images</h2>
            <label className="block text-sm font-medium text-foreground/80 mb-2">Cover Image (Main Hero & Thumbnail)</label>
            <label className="w-full border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-foreground/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden group mb-6">
              <input onChange={handleImageChange} type="file" name="coverImage" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" />
              {previewImage ? (
                <div className="absolute inset-0 w-full h-full z-0 opacity-40 group-hover:opacity-20 transition-opacity">
                  <img src={previewImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              ) : null}
              <ImageIcon size={32} className={`mb-2 transition-transform relative z-10 ${previewImage ? '' : 'group-hover:scale-110'}`} />
              <p className="text-sm font-medium transition-colors relative z-10 group-hover:text-brand-500">
                {previewImage ? "Click to change cover image" : "Click to upload a cover image"}
              </p>
              <p className="text-xs mt-1 relative z-10">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </label>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Additional Gallery Images (Max 5)</label>
              <input name="images" type="file" multiple accept="image/*" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
            </div>
          </section>

        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-surface-900 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3">
          <Link href="/dashboard" className="px-6 py-2.5 rounded-xl font-medium border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
            <Save size={18} /> {loading ? "Saving..." : "Save to Database"}
          </button>
        </div>
      </form>
    </div>
  );
}
