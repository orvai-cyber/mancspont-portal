import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductImageGallery({ photos, productName }) {
  const [selectedImage, setSelectedImage] = useState(photos[0]);

  return (
    <div>
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={selectedImage}
            alt={productName}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
      <div className="flex gap-3">
        {photos.map((photo, index) => (
          <button 
            key={index}
            onClick={() => setSelectedImage(photo)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === photo ? 'border-green-600 scale-105' : 'border-transparent hover:border-gray-300'}`}
          >
            <img src={photo} alt={`${productName} - thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
          </button>
        ))}
      </div>
    </div>
  );
}