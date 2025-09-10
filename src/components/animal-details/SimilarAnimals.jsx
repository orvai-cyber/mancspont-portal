import React, { useState, useEffect } from 'react';
import { Animal } from '@/api/entities';
import AnimalCard from '../animals/AnimalCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function SimilarAnimals({ currentAnimal }) {
  const [similarAnimals, setSimilarAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSimilarAnimals = async () => {
      if (!currentAnimal || !currentAnimal.species) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // Get animals of the same species first
        const allAnimals = await Animal.filter(
          { species: currentAnimal.species }, 
          '-created_date', 
          12
        );
        
        // Filter out the current animal and prioritize by same breed, then same size
        const filtered = allAnimals
          .filter(animal => animal.id !== currentAnimal.id)
          .sort((a, b) => {
            // Prioritize same breed
            if (a.breed === currentAnimal.breed && b.breed !== currentAnimal.breed) return -1;
            if (b.breed === currentAnimal.breed && a.breed !== currentAnimal.breed) return 1;
            
            // Then prioritize same size
            if (a.size === currentAnimal.size && b.size !== currentAnimal.size) return -1;
            if (b.size === currentAnimal.size && a.size !== currentAnimal.size) return 1;
            
            return 0;
          })
          .slice(0, 6);

        setSimilarAnimals(filtered);
      } catch (error) {
        console.error('Error loading similar animals:', error);
      }
      setIsLoading(false);
    };

    loadSimilarAnimals();
  }, [currentAnimal]);

  if (isLoading) {
    return (
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Ők is gazdira vágynak</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (similarAnimals.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Ők is gazdira vágynak</h2>
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => window.open('/animals', '_blank')}
        >
          További gazdit keresők
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarAnimals.map((animal, index) => (
          <motion.div
            key={animal.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <AnimalCard animal={animal} viewMode="grid" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}