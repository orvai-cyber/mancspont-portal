
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

// New import as per outline
import ResponsiveImage from '../shared/ResponsiveImage';

// Imports required for the new AnimalCard definition
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom'; // Assuming react-router-dom for Link
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, PawPrint, MapPin } from 'lucide-react';

// Placeholder/mock for HeartFilled - assuming it's a specific filled heart icon.
// If it's a component from another library, it would need a proper import.
// For a functional file, we provide a simple implementation.
const HeartFilled = (props) => <Heart {...props} fill="currentColor" />;

// Placeholder/mock implementations for context hooks and utility function
// In a real application, these would be imported from their respective paths.
const useAuthContext = () => ({ isAuthenticated: true, user: { id: 'mock_user_id' } });
const useNotification = () => ({
  addNotification: (message, type) => {
    console.log(`Notification (${type}): ${message}`);
  },
});
const createPageUrl = (path) => {
  // This mock simulates a URL creation, e.g., for a hash router
  return `/#/${path}`;
};

// AnimalCard component definition as provided in the outline
const AnimalCard = ({ animal }) => {
  const { isAuthenticated } = useAuthContext();
  const { addNotification } = useNotification();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // In a real application, fetch the actual favorite status
    // For this example, we'll mock it based on animal ID
    setIsFavorite(animal.id % 2 === 0);
  }, [animal.id]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      addNotification("Kérjük, jelentkezzen be a kedvencek kezeléséhez.", "error");
      return;
    }

    try {
      // Simulate API call to toggle favorite status
      setIsFavorite((prev) => !prev);
      addNotification(`Sikeresen ${isFavorite ? 'eltávolítva' : 'hozzáadva'} a kedvencekhez!`, "success");
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      addNotification("Hiba történt a kedvencek kezelése közben.", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden bg-white h-full">
        <div className="relative">
          <Link to={createPageUrl(`AnimalDetails?id=${animal.id}`)}>
            <ResponsiveImage
              src={
                animal.photos && animal.photos.length > 0
                  ? animal.photos[0]
                  : `https://placehold.co/600x400/e2e8f0/cccccc/png?text=${encodeURIComponent(animal.name.charAt(0))}`
              }
              alt={animal.name}
              size="medium"
              aspectRatio="square"
              className="h-64 transition-transform duration-300 group-hover:scale-110 object-cover w-full"
            />
          </Link>

          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {animal.status === 'adopted' && (
              <Badge variant="destructive" className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Örökbefogadva</Badge>
            )}
            {animal.isSpecialNeeds && (
              <Badge variant="secondary" className="bg-orange-400 text-white px-2 py-1 rounded-full text-xs font-semibold">Különleges igényű</Badge>
            )}
            {animal.isNew && (
              <Badge className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Új</Badge>
            )}
          </div>

          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white bg-opacity-70 backdrop-blur-sm hover:bg-opacity-90"
              onClick={handleFavoriteToggle}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <HeartFilled className="h-5 w-5 text-red-500" />
              ) : (
                <Heart className="h-5 w-5 text-gray-500" />
              )}
            </Button>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-2">{animal.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{animal.breed || 'Vegyes fajtájú'}</p>
          </div>
          <div className="mt-auto">
            <div className="flex items-center text-gray-600 text-sm mb-1">
              <PawPrint className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>{animal.age || 'Ismeretlen korú'}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>{animal.location || 'Ismeretlen hely'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


export default function FeaturedAnimals({ animals, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-96 rounded-2xl" />
        ))}
      </div>
    );
  }

  // Filter out invalid animals with comprehensive checks
  const validAnimals = (animals || []).filter(animal =>
    animal &&
    typeof animal === 'object' &&
    animal.id &&
    animal.name &&
    typeof animal.name === 'string' &&
    animal.name.trim() !== '' &&
    animal.name !== 'undefined' &&
    animal.name !== 'null'
  );

  if (validAnimals.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <p className="text-gray-600">Jelenleg nincsenek kiemelt állatok.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {validAnimals.map(animal => {
        // Extra safety check before rendering
        if (!animal || !animal.id || !animal.name || typeof animal.name !== 'string' || animal.name.trim() === '') {
          return null;
        }
        return (
          // The viewMode prop is no longer consumed by the AnimalCard defined in this file.
          <AnimalCard key={animal.id} animal={animal} />
        );
      })}
    </motion.div>
  );
}
