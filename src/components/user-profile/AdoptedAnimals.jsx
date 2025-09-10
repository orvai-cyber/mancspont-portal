import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdoptedAnimals({ animals }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Az örökbefogadott állataim</h2>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          {animals.length} négylábú családtag
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {animals.map((animal, index) => (
          <motion.div
            key={animal.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <div className="relative">
                <img 
                  src={animal.photo}
                  alt={animal.name}
                  className="h-48 w-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow">
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{animal.name}</h3>
                  <Badge variant="secondary" className="capitalize">{animal.species}</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-3">{animal.breed}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Örökbefogadva: {new Date(animal.adoptedDate).toLocaleDateString('hu-HU')}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {animal.story}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}