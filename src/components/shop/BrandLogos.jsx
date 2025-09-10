import React from 'react';
import { motion } from 'framer-motion';

const mockBrands = [
  'https://via.placeholder.com/150x50/cccccc/808080?text=Royal+Canin',
  'https://via.placeholder.com/150x50/cccccc/808080?text=Acana',
  'https://via.placeholder.com/150x50/cccccc/808080?text=Hill-s',
  'https://via.placeholder.com/150x50/cccccc/808080?text=Purina',
  'https://via.placeholder.com/150x50/cccccc/808080?text=Trixie',
  'https://via.placeholder.com/150x50/cccccc/808080?text=Fressnapf',
  'https://via.placeholder.com/150x50/cccccc/808080?text=Julius-K9'
];

export default function BrandLogos({ brands }) {
  const displayBrands = [...mockBrands, ...mockBrands]; // Duplicate for seamless loop

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold text-gray-400 mb-10">
          Partnereink, akiknek a minőségében megbízunk
        </h2>
        <div className="relative overflow-hidden">
          <motion.div 
            className="flex space-x-16"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ ease: 'linear', duration: 25, repeat: Infinity }}
          >
            {displayBrands.map((logo, i) => (
              <img key={i} src={logo} alt={`Brand ${i}`} className="max-h-10 opacity-70" />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}