import React, { useState, useEffect, useCallback } from 'react';
import { User, Favorite } from '@/api/entities';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FavoriteButton({ animalId, animal }) {
  const [user, setUser] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkUserAndFavoriteStatus = useCallback(async () => {
    if (!animalId) return;
    
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // Check if this animal is already favorited
      const favorites = await Favorite.filter({ 
        user_id: currentUser.id, 
        animal_id: animalId 
      });
      setIsFavorited(favorites.length > 0);
    } catch (error) {
      // User not logged in or other error
      setUser(null);
      setIsFavorited(false);
    }
  }, [animalId]);

  useEffect(() => {
    checkUserAndFavoriteStatus();
  }, [checkUserAndFavoriteStatus]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Prevent navigation when button is clicked
    e.stopPropagation();
    
    if (!user || !animalId) {
      // Redirect to login if user is not authenticated
      await User.login();
      return;
    }

    setIsLoading(true);
    
    try {
      if (isFavorited) {
        // Remove from favorites
        const favorites = await Favorite.filter({ 
          user_id: user.id, 
          animal_id: animalId 
        });
        
        if (favorites.length > 0) {
          // Delete all matching favorites (there should only be one)
          await Promise.all(favorites.map(fav => Favorite.delete(fav.id)));
        }
        setIsFavorited(false);
      } else {
        // Add to favorites - safely access animal properties
        await Favorite.create({
          user_id: user.id,
          user_email: user.email,
          animal_id: animalId,
          animal_name: animal?.name || 'Névtelen állat',
          animal_photo: animal?.photos?.[0] || '',
          shelter_name: animal?.shelter_name || 'Ismeretlen menhely'
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`rounded-full backdrop-blur-sm transition-all duration-300 ${
        isFavorited 
          ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
          : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
      }`}
    >
      <Heart 
        className={`w-4 h-4 transition-all duration-300 ${
          isFavorited ? 'fill-current scale-110' : 'scale-100'
        }`} 
      />
    </Button>
  );
}