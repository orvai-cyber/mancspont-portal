import React from 'react';
import { motion } from 'framer-motion';
import { Home, Sun, School, UserCheck } from 'lucide-react';

const icons = {
  Home, Sun, School, UserCheck
};

export default function ServiceHero({ activeCategory, onCategoryChange, categoryConfig }) {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-indigo-700 to-black text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
          Megbízható szakértők kedvencednek
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
          Találd meg a tökéletes panziót, kutyaiskolát vagy szittert. Mindent egy helyen, gazdiktól gazdiknak.
        </p>
        
        <div className="bg-black/30 backdrop-blur-md border border-white/10 inline-block p-2 rounded-2xl">
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(categoryConfig).map(([key, { name, icon }]) => {
              const Icon = icons[icon];
              return (
                <button
                  key={key}
                  onClick={() => onCategoryChange(key)}
                  className={`relative px-4 py-2.5 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black flex items-center gap-2 w-full sm:w-auto justify-center ${
                    activeCategory === key ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {activeCategory === key && (
                    <motion.div
                      layoutId="service-active-pill"
                      className="absolute inset-0 bg-indigo-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5 z-10" />
                  <span className="z-10">{name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}