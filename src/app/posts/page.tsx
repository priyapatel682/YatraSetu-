"use client";

import Link from "next/link";
import { Clock, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch posts:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-brand-50 py-32 flex items-center justify-center font-medium text-brand-600">Loading articles...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Temple Articles & Posts</h1>
          <p className="text-xl text-brand-600 font-medium mb-6">Discover history, architecture, and spiritual guides</p>
          <div className="w-24 h-1 bg-brand-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id || post._id} href={`/posts/${post.id || post._id}`} className="glassmorphism rounded-3xl overflow-hidden card-shadow border border-white/20 flex flex-col group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/60">
              {/* Image / Placeholder */}
              <div className={`h-48 w-full ${post.imageColor || 'bg-brand-100'} flex items-center justify-center relative overflow-hidden`}>
                {post.image ? (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${post.image}`} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <span className="text-foreground/40 font-medium">No Image</span>
                  </>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-600 shadow-sm z-10">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-brand-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-foreground/70 text-sm leading-relaxed mb-6 flex-grow">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-medium text-foreground/80">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-foreground/50 text-xs">
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
