import React, { useState, useEffect } from 'react';
import { Animal } from '@/api/entities';
import AnimalCard from '../animals/AnimalCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AnimalGrid({ shelterName }) {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnimals = async () => {
      setIsLoading(true);
      try {
        if (!shelterName) {
          setAnimals([]);
          setIsLoading(false);
          return;
        }

        const shelterAnimals = await Animal.filter({ shelter_name: shelterName }, '-created_date', 6);
        
        // Filter out invalid animals with comprehensive checks
        const validAnimals = (shelterAnimals || []).filter(animal => 
          animal && 
          typeof animal === 'object' &&
          animal.id && 
          animal.name && 
          typeof animal.name === 'string' &&
          animal.name.trim() !== '' &&
          animal.name !== 'undefined' &&
          animal.name !== 'null'
        );
        
        setAnimals(validAnimals);
      } catch (error) {
        console.error('Error loading animals:', error);
        setAnimals([]);
      }
      setIsLoading(false);
    };

    loadAnimals();
  }, [shelterName]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Gazdira váró lakóink</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gazdira váró lakóink</h2>
        {animals.length > 0 && (
          <Link to={createPageUrl(`Animals?shelter=${encodeURIComponent(shelterName || '')}`)}>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              Összes állat ({animals.length}+)
            </Button>
          </Link>
        )}
      </div>

      {animals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map(animal => {
            // Extra safety check before rendering
            if (!animal || !animal.id || !animal.name || typeof animal.name !== 'string' || animal.name.trim() === '') {
              return null;
            }
            return (
              <AnimalCard key={animal.id} animal={animal} viewMode="grid" />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-600">Jelenleg nincsenek örökbefogadható állatok.</p>
        </div>
      )}
    </div>
  );
}