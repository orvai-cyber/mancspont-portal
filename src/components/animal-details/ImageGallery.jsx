
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ImageGallery({ photos, name }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Az 'useEffect' segítségével kezeljük a billentyűlenyomásokat a lightbox bezárásához
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') {
          setIsLightboxOpen(false);
        }
        if (e.key === 'ArrowRight') {
          handleNext();
        }
        if (e.key === 'ArrowLeft') {
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, handleNext, handlePrev]);


  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };
  
  const mainImage = photos[currentIndex];

  return (
    <div>
      {/* Kisméretű galéria */}
      <div className="relative mb-4 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={mainImage}
            src={mainImage}
            alt={name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full aspect-square object-cover rounded-2xl shadow-lg cursor-zoom-in"
            onClick={openLightbox}
          />
        </AnimatePresence>
        
        {/* Nagyítás ikon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl">
            <ZoomIn className="w-12 h-12 text-white" />
        </div>

        {/* Gyors lapozó gombok */}
        {photos.length > 1 && (
            <>
                <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition">
                <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition">
                <ChevronRight className="w-5 h-5" />
                </button>
            </>
        )}
      </div>

      {/* Kis bélyegképek */}
      <div className="grid grid-cols-4 gap-2">
        {photos.map((photo, index) => (
          <button key={index} onClick={() => handleThumbnailClick(index)}>
            <img
              src={photo}
              alt={`${name} thumbnail ${index + 1}`}
              className={`w-full h-20 object-cover rounded-lg transition-all duration-200 ${
                mainImage === photo
                  ? 'ring-2 ring-green-500 ring-offset-2 scale-105'
                  : 'opacity-70 hover:opacity-100'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Lightbox / Nagyított nézet */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Lapozó gombok */}
            {photos.length > 1 && (
                <>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition-colors"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleNext(); }} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition-colors"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </>
            )}

            {/* Bezárás gomb */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }} 
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Számláló */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                {currentIndex + 1} / {photos.length}
            </div>

            {/* Kép konténer */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={photos[currentIndex]}
                    alt={name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} // Megakadályozza a bezárást a képre kattintva
                />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
