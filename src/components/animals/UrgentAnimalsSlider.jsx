import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Heart, MapPin, Clock } from 'lucide-react';

// Safe animal creator function
const createSafeAnimal = (animal) => {
  if (!animal || typeof animal !== 'object') {
    return null;
  }

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
    shelter_name: animal.shelter_name && typeof animal.shelter_name === 'string' ? String(animal.shelter_name) : 'Ismeretlen menhely',
    description: animal.description && typeof animal.description === 'string' ? String(animal.description) : '',
    is_urgent: Boolean(animal.is_urgent)
  };
};

export default function UrgentAnimalsSlider({ animals }) {
  // Filter out invalid animals and ensure they have urgent status
  const validUrgentAnimals = (animals || [])
    .map(createSafeAnimal)
    .filter(animal => animal !== null && animal.is_urgent === true);

  if (!validUrgentAnimals || validUrgentAnimals.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <Alert className="border-red-200 bg-red-50/50 mb-6">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Sürgős esetek!</strong> Ezeknek az állatoknak azonnal új otthonra van szükségük.
        </AlertDescription>
      </Alert>

      {/* Simple responsive grid instead of slider */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {validUrgentAnimals.slice(0, 8).map(safeAnimal => (
          <div key={safeAnimal.id} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
            <div className="flex flex-col h-full">
              <div className="relative mb-4">
                <img
                  src={safeAnimal.photos[0] || `https://placehold.co/400x300/fee2e2/dc2626/png?text=${encodeURIComponent(safeAnimal.name.charAt(0))}`}
                  alt={safeAnimal.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <Badge variant="destructive" className="absolute top-3 left-3 animate-pulse">
                  <Clock className="w-3 h-3 mr-1" />
                  Sürgős
                </Badge>
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                  {safeAnimal.name}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <span className="capitalize font-medium">{safeAnimal.species}</span>
                  <span>•</span>
                  <span className="capitalize">{safeAnimal.age}</span>
                  <span>•</span>
                  <span className="capitalize">{safeAnimal.gender}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{safeAnimal.location}</span>
                </div>

                {safeAnimal.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {safeAnimal.description.substring(0, 100)}...
                  </p>
                )}
              </div>

              <Link 
                to={createPageUrl(`AnimalDetails?id=${safeAnimal.id}`)}
                className="w-full"
              >
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <Heart className="w-4 h-4 mr-2" />
                  Segítek neki
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}