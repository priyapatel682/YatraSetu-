import Link from "next/link";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PostDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let post = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts/${resolvedParams.id}`, { cache: 'no-store' });
    if (res.ok) {
      post = await res.json();
    }
  } catch (err) {
    console.error(err);
  }

  if (!post) {
    notFound();
  }

  // Basic markdown-like parser for the content (fallback for old posts)
  const renderContent = (text: string) => {
    if (!text) return null;
    
    // Check if the content is HTML (from React Quill)
    if (text.trim().startsWith('<') && text.includes('</')) {
      // Replace non-breaking spaces which prevent natural text wrapping in HTML
      const cleanHtml = text.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
      return (
        <div className="w-full [&_p:empty]:h-6 [&_p]:break-words" dangerouslySetInnerHTML={{ __html: cleanHtml }} />
      );
    }

    const blocks = text.trim().split('\n\n');
    return blocks.map((block, i) => {
      if (block.startsWith('### ')) {
        return <h3 key={i} className="text-2xl font-bold text-foreground mt-10 mb-4">{block.replace('### ', '')}</h3>;
      }
      if (block.startsWith('* ')) {
        const listItems = block.split('\n').map(item => item.replace('* ', '').trim()).filter(Boolean);
        return (
          <ul key={i} className="list-disc list-inside space-y-2 mb-6 text-foreground/80 leading-relaxed text-lg">
            {listItems.map((li, j) => {
              // Handle bolding like **text**
              const parts = li.split('**');
              return (
                <li key={j}>
                  {parts.map((part, k) => (k % 2 === 1 ? <strong key={k} className="text-foreground font-semibold">{part}</strong> : part))}
                </li>
              );
            })}
          </ul>
        );
      }
      return <p key={i} className="text-lg text-foreground/80 leading-relaxed mb-6">{block.trim()}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-brand-50/50 pb-20">
      {/* Hero Header Section */}
      <div className={`w-full pt-32 pb-16 px-4 ${post.imageColor || 'bg-brand-100'} relative overflow-hidden flex flex-col items-center justify-center text-center`}>
        {post.image && (
          <img src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${post.image}`} alt={post.title} className="absolute inset-0 w-full h-full object-cover z-0" />
        )}
        <div className={`absolute inset-0 z-0 bg-gradient-to-t ${post.image ? 'from-black/80 via-black/40 to-black/20' : 'from-black/40 via-transparent to-transparent'}`}></div>
        {!post.image && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>}
        
        <div className="relative z-10 max-w-4xl mx-auto mt-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-brand-700 font-bold tracking-wide uppercase text-sm mb-6 shadow-sm">
            {post.category}
          </div>
          <h1 className={`text-4xl md:text-6xl font-extrabold drop-shadow-md mb-6 leading-tight ${post.image ? 'text-white' : 'text-gray-900'}`}>
            {post.title}
          </h1>
          <p className={`text-xl md:text-2xl font-medium opacity-90 drop-shadow-sm max-w-2xl mx-auto ${post.image ? 'text-gray-200' : 'text-gray-800'}`}>
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-20">
        
        <div className="bg-white dark:bg-surface-900 rounded-3xl p-8 md:p-12 card-shadow border border-white/20">
          
          <Link href="/posts" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium mb-10 group">
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
              <ArrowLeft size={16} />
            </div>
            Back to all posts
          </Link>

          {/* Author Meta Info */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-100 dark:border-white/10 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xl font-bold shadow-inner">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-foreground/50 font-medium">Written by</p>
                <p className="font-bold text-foreground">{post.author}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 ml-auto">
              <div className="flex items-center gap-2 text-foreground/60">
                <Calendar size={18} />
                <span className="font-medium">{post.date}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/60">
                <Clock size={18} />
                <span className="font-medium">{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Rendered Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-brand-600">
            {renderContent(post.content)}
          </article>
          
        </div>

      </div>
    </div>
  );
}
