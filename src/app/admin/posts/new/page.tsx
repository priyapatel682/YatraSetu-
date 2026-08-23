"use client";

import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function NewPostPage() {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [content, setContent] = useState('');

  const router = useRouter();

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
    
    try {
      const formData = new FormData(e.currentTarget);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create post");
      
      // Clean up object URL
      if (previewImage) URL.revokeObjectURL(previewImage);
      
      router.push("/dashboard/posts");
    } catch (err) {
      console.error(err);
      alert("An error occurred while publishing the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/posts" className="p-2 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Write New Post</h1>
          <p className="text-foreground/60 text-sm mt-1">Publish an article, guide, or story.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 card-shadow overflow-hidden">
        
        <div className="p-6 md:p-8 space-y-8">
          {/* Basic Info */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground/80 mb-2">Post Title *</label>
                <input required name="title" type="text" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none text-lg" placeholder="e.g. The Architectural Marvel of Kailasanathar Temple" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground/80 mb-2">Short Description (Excerpt) *</label>
                <textarea required name="excerpt" rows={2} className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="A brief summary of the post..."></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Category *</label>
                <select required name="category" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none">
                  <option value="">Select Category</option>
                  <option value="Architecture">Architecture</option>
                  <option value="History">History</option>
                  <option value="Rituals">Rituals</option>
                  <option value="Travel Guide">Travel Guide</option>
                  <option value="Festivals">Festivals</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Author Name *</label>
                <input required name="author" type="text" defaultValue="Admin User" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Publish Date *</label>
                <input required name="date" type="date" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">Read Time *</label>
                <input required name="readTime" type="text" placeholder="e.g. 5 min read" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground/80 mb-2">Theme Color (Hero Background) *</label>
                <select required name="imageColor" className="block w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-surface-900 focus:ring-2 focus:ring-brand-500 outline-none">
                  <option value="bg-amber-100">Amber (bg-amber-100)</option>
                  <option value="bg-blue-100">Blue (bg-blue-100)</option>
                  <option value="bg-emerald-100">Emerald (bg-emerald-100)</option>
                  <option value="bg-orange-100">Orange (bg-orange-100)</option>
                  <option value="bg-purple-100">Purple (bg-purple-100)</option>
                  <option value="bg-brand-100">Brand Default (bg-brand-100)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Cover Image Upload Placeholder */}
          <section>
            <label className="block text-sm font-medium text-foreground/80 mb-2">Cover Image</label>
            <label className="w-full border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-foreground/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden group">
              <input onChange={handleImageChange} type="file" name="coverImage" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" />
              {previewImage ? (
                <div className="absolute inset-0 w-full h-full z-0 opacity-40 group-hover:opacity-20 transition-opacity">
                  <img src={previewImage} alt="Selected preview" className="w-full h-full object-cover" />
                </div>
              ) : null}
              <ImageIcon size={32} className={`mb-2 transition-transform relative z-10 ${previewImage ? '' : 'group-hover:scale-110'}`} />
              <p className="text-sm font-medium transition-colors relative z-10 group-hover:text-brand-500">
                {previewImage ? "Click to change cover image" : "Click to upload a cover image"}
              </p>
              <p className="text-xs mt-1 relative z-10">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </label>
          </section>

          {/* Content */}
          <section className="quill-container">
            <label className="block text-sm font-medium text-foreground/80 mb-2">Post Content *</label>
            <div className="bg-white dark:bg-surface-900 border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                className="h-64 sm:h-96"
                placeholder="Write your article content here..."
              />
              <input type="hidden" name="content" value={content} required />
            </div>
            {/* Some simple inline styles to fix Quill on dark mode */}
            <style jsx global>{`
              /* Make the quill root a flex column */
              .quill-container .quill {
                display: flex;
                flex-direction: column;
              }
              .quill-container .ql-toolbar {
                position: sticky;
                top: 0;
                z-index: 40;
                border: none;
                border-bottom: 1px solid rgba(156, 163, 175, 0.2);
                background-color: #f9fafb; /* Solid background to prevent overlap */
              }
              .quill-container .ql-container {
                border: none;
                font-family: inherit;
                font-size: 1rem;
                flex: 1;
                overflow-y: auto;
              }
              .dark .quill-container .ql-toolbar {
                background-color: #18181b; /* Solid dark background */
              }
              .dark .quill-container .ql-stroke {
                stroke: #e5e7eb;
              }
              .dark .quill-container .ql-fill {
                fill: #e5e7eb;
              }
              .dark .quill-container .ql-picker {
                color: #e5e7eb;
              }
            `}</style>
          </section>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-surface-900 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3">
          <Link href="/dashboard/posts" className="px-6 py-2.5 rounded-xl font-medium border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
            <Save size={18} /> {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
