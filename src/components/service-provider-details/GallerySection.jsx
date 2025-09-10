import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

export default function GallerySection({ photos }) {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Galéria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-lg transition-all duration-300">
                    <img 
                      src={photo} 
                      alt={`Galéria kép ${index + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-2">
                  <img 
                    src={photo} 
                    alt={`Galéria kép ${index + 1}`} 
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}