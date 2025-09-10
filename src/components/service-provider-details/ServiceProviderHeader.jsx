
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MapPin } from 'lucide-react';
import ResponsiveImage from '../shared/ResponsiveImage'; // Importáljuk az új komponenst

export default function ServiceProviderHeader({ provider }) {
  const categoryLabels = {
    panzio: 'Kutyapanzió',
    napköz: 'Kutyanapközi', 
    iskola: 'Kutyaiskola',
    szitter: 'Szitter'
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
              <ResponsiveImage 
                src={provider.main_photo_url}
                alt={provider.name}
                size="medium"
                aspectRatio="square"
                className="w-full h-full object-cover"
                priority={true} // Prioritásos betöltés a fejlécben
              />
            </div>
          </motion.div>

          {/* Service Provider Info */}
          <div className="flex-grow">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4"
            >
              <Badge className="bg-white/20 text-white backdrop-blur-md border-none mb-3">
                {categoryLabels[provider.category]}
              </Badge>
              {provider.verified && (
                <Badge className="bg-green-500/20 text-white backdrop-blur-md border-none ml-2">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ellenőrzött
                </Badge>
              )}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg"
            >
              {provider.name}
            </motion.h1>
            
            {provider.tagline && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg md:text-xl text-white/90 mb-4 max-w-3xl"
              >
                {provider.tagline}
              </motion.p>
            )}
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center text-white/80"
            >
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">{provider.location}, {provider.county}</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
