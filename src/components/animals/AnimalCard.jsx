
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import FavoriteButton from '../shared/FavoriteButton';
import ResponsiveImage from '../shared/ResponsiveImage';

// Univerzális animal safety function
const createSafeAnimal = (animal) => {
  if (!animal || typeof animal !== 'object') {
    return null;
  }

  // Check if required properties exist and are valid
  if (!animal.id || !animal.name || typeof animal.name !== 'string' || animal.name.trim() === '') {
    return null;
  }

  return {
    id: String(animal.id),
    name: String(animal.name).trim(),
    species: animal.species && typeof animal.species === 'string' ? String(animal.species) : 'Állat',
    age: animal.age && typeof animal.age === 'string' ? String(animal.age) : 'N/A',
    gender: animal.gender && typeof animal.gender === 'string' ? String(animal.gender) : 'N/A',
    location: animal.location && typeof animal.location === 'string' ? String(animal.location) : 'Nincs megadva',
    photos: Array.isArray(animal.photos) ? animal.photos : [],
    is_urgent: Boolean(animal.is_urgent),
    shelter_name: animal.shelter_name && typeof animal.shelter_name === 'string' ? String(animal.shelter_name) : 'Ismeretlen menhely',
    description: animal.description && typeof animal.description === 'string' ? String(animal.description) : ''
  };
};

// Magyar fordítások
const translateToHungarian = {
  // Fajok
  'kutya': 'Kutya',
  'macska': 'Macska',
  'nyul': 'Nyúl',
  'nyúl': 'Nyúl',
  'házihör': 'Házihör',
  'madár': 'Madár',
  'madàr': 'Madár',
  'egyéb': 'Egyéb',

  // Korok
  'kölyök': 'Kölyök',
  'kolyok': 'Kölyök', 
  'felnőtt': 'Felnőtt',
  'felnott': 'Felnőtt',
  'idős': 'Idős',
  'idos': 'Idős',

  // Nemek
  'hím': 'Hím',
  'him': 'Hím',
  'nőstény': 'Nőstény',
  'nosteny': 'Nőstény'
};

const getHungarianText = (text) => {
  return translateToHungarian[text?.toLowerCase()] || text;
};

export default function AnimalCard({ animal, viewMode = 'grid' }) {
  const safeAnimal = createSafeAnimal(animal);
  
  if (!safeAnimal) {
    return null;
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group h-full"
    >
      <Card className={`overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 h-full flex flex-col ${viewMode === 'list' ? 'md:flex-row' : ''}`}>
        <div className={`relative ${viewMode === 'list' ? 'md:w-1/3' : ''}`}>
          <Link to={createPageUrl(`AnimalDetails?id=${safeAnimal.id}`)}>
            <ResponsiveImage
              src={safeAnimal.photos[0] || `https://placehold.co/600x400/e2e8f0/cccccc/png?text=${encodeURIComponent(safeAnimal.name.charAt(0))}`}
              alt={safeAnimal.name}
              size={viewMode === 'list' ? 'medium' : 'medium'}
              aspectRatio="square"
              className={`transition-transform duration-300 group-hover:scale-110 ${viewMode === 'grid' ? 'h-64' : 'h-48 md:h-full'}`}
            />
          </Link>
          <div className="absolute top-4 right-4">
            <FavoriteButton animalId={safeAnimal.id} animal={safeAnimal} />
          </div>
          {safeAnimal.is_urgent && (
            <Badge variant="destructive" className="absolute top-4 left-4 animate-pulse">Sürgős</Badge>
          )}
        </div>

        <CardContent className={`p-6 bg-white flex flex-col flex-grow ${viewMode === 'list' ? 'md:w-2/3' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 capitalize">
              {getHungarianText(safeAnimal.species)}
            </Badge>
            <div className="text-sm font-medium text-gray-600">
              {getHungarianText(safeAnimal.age)}, {getHungarianText(safeAnimal.gender)}
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-1 truncate">{safeAnimal.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <MapPin className="w-4 h-4" />
            <span>{safeAnimal.location}</span>
          </div>

          <Link 
            to={createPageUrl(`AnimalDetails?id=${safeAnimal.id}`)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 mt-auto bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-300"
          >
            Megismerem <ArrowRight className="w-4 h-4" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
