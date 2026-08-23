"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ImageGallery({ images }: { images: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const galleryImages = images;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  return (
    <>
      <section className="glassmorphism p-8 rounded-3xl border border-white/20 card-shadow">
        <h2 className="text-2xl font-bold text-foreground mb-4">Temple Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img: string, i: number) => (
            <div 
              key={i} 
              onClick={() => openLightbox(i)}
              className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <img src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${img}`} alt={`Gallery image ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
            >
              <X size={32} />
            </button>

            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-12 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
            >
              <ChevronLeft size={48} />
            </button>

            <motion.div 
              key={currentIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${galleryImages[currentIndex]}`} 
                alt={`Slideshow image ${currentIndex + 1}`} 
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            </motion.div>

            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-12 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
            >
              <ChevronRight size={48} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
