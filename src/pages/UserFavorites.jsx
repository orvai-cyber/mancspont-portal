import React, { useState, useEffect } from 'react';
import { Favorite, Animal, User } from '@/api/entities';
import { Heart, Frown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import UserLayout from '../components/user/UserLayout';
import AnimalCard from '../components/animals/AnimalCard';

export default function UserFavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserFavorites();
  }, []);

  const loadUserFavorites = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Kedvencek betöltése
      const userFavorites = await Favorite.filter({ user_email: user.email });
      setFavorites(userFavorites);

      // Aktív állatok betöltése (hogy ellenőrizzük, melyik állat létezik még)
      if (userFavorites.length > 0) {
        const animalIds = userFavorites.map(fav => fav.animal_id);
        const allAnimals = await Animal.list();
        const activeAnimals = allAnimals.filter(animal => animalIds.includes(animal.id));
        setAnimals(activeAnimals);

        // Eltávolítjuk azokat a kedvenceket, amelyek állatai már nem léteznek
        const activeAnimalIds = activeAnimals.map(animal => animal.id);
        const outdatedFavorites = userFavorites.filter(fav => !activeAnimalIds.includes(fav.animal_id));
        
        for (const outdated of outdatedFavorites) {
          await Favorite.delete(outdated.id);
        }
        
        // Frissített kedvencek lista
        const updatedFavorites = userFavorites.filter(fav => activeAnimalIds.includes(fav.animal_id));
        setFavorites(updatedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    setIsLoading(false);
  };

  const handleRemoveFavorite = async (animalId) => {
    try {
      const favoriteToRemove = favorites.find(fav => fav.animal_id === animalId);
      if (favoriteToRemove) {
        await Favorite.delete(favoriteToRemove.id);
        setFavorites(prev => prev.filter(fav => fav.animal_id !== animalId));
        setAnimals(prev => prev.filter(animal => animal.id !== animalId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <UserLayout currentUser={currentUser}>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kedvenceim</h1>
                <p className="text-gray-600">Az általad kedvelt állatok listája</p>
              </div>
            </div>
            
            {!isLoading && (
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-800">
                    <span className="text-red-600">{animals.length}</span> kedvenc állat
                  </span>
                  {animals.length > 0 && (
                    <Button variant="outline" size="sm">
                      <Link to={createPageUrl("Animals")} className="flex items-center gap-2">
                        Több állat böngészése
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="rounded-2xl h-96" />
              ))}
            </div>
          ) : animals.length > 0 ? (
            <motion.div layout className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence>
                {animals.map(animal => (
                  <motion.div
                    layout
                    key={animal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                  >
                    <AnimalCard animal={animal} viewMode="grid" />
                    
                    {/* Eltávolítás gomb */}
                    <div className="absolute top-3 right-3 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/90 backdrop-blur-sm hover:bg-red-50 shadow-md"
                        onClick={() => handleRemoveFavorite(animal.id)}
                      >
                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Még nincs kedvenced</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Böngészd az örökbefogadható állatokat, és add hozzá kedvenceidhez azokat, akik megtetszettek!
              </p>
              <Link to={createPageUrl("Animals")}>
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  <Heart className="w-5 h-5 mr-2" />
                  Állatok böngészése
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}