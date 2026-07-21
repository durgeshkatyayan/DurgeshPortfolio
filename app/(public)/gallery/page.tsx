"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

interface GalleryItem {
  _id: string;
  title: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  album: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await axios.get("/api/gallery");
        setItems(data);
      } catch (error) {
        console.error("Failed to load gallery", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading gallery...</div>;
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white py-24 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-12 text-center">Visual Gallery</h1>

      {/* Tailwind CSS Masonry Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="relative break-inside-avoid rounded-xl overflow-hidden group border border-neutral-800 bg-neutral-900"
          >
            {item.mediaType === "image" ? (
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <video
                src={item.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <div>
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1 block">
                  {item.album}
                </span>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}