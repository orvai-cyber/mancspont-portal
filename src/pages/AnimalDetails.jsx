
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Animal, Shelter, User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Share2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import ImageGallery from '../components/animal-details/ImageGallery';
import AnimalHeader from '../components/animal-details/AnimalHeader';
import AnimalMeta from '../components/animal-details/AnimalMeta';
import ActionButtons from '../components/animal-details/ActionButtons';
import DescriptionSection from '../components/animal-details/DescriptionSection';
import PropertiesSection from '../components/animal-details/PropertiesSection';
import AdoptionProcess from '../components/animal-details/AdoptionProcess';
import ShelterInfoCard from '../components/animal-details/ShelterInfoCard';
import SimilarAnimals from '../components/animal-details/SimilarAnimals';
import FaqSection from '../components/animal-details/FaqSection';
import DonationSidebar from '../components/animal-details/DonationSidebar';

export default function AnimalDetailsPage() {
  const [animal, setAnimal] = useState(null);
  const [shelter, setShelter] = useState(null);
  const [user, setUser] = useState(null);
  const [similarAnimals, setSimilarAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shelterLoading, setShelterLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log('User not logged in:', error);
      setUser(null);
    }
  }, []);

  const loadShelterByName = useCallback(async (shelterName) => {
    setShelterLoading(true);
    try {
      console.log('Fetching shelter with name:', shelterName);
      
      // Menhely keresése név alapján
      const shelters = await Shelter.filter({ name: shelterName });
      console.log('Found shelters:', shelters);
      
      if (shelters && shelters.length > 0) {
        setShelter(shelters[0]);
        console.log('Shelter set:', shelters[0]);
      } else {
        // Ha nincs találat, próbáljunk case-insensitive keresést
        console.log('No exact match, trying case-insensitive search');
        const allShelters = await Shelter.list();
        const matchingShelter = allShelters.find(s => 
          s.name.toLowerCase() === shelterName.toLowerCase()
        );
        
        if (matchingShelter) {
          setShelter(matchingShelter);
          console.log('Case-insensitive match found:', matchingShelter);
        } else {
          console.warn('No shelter found with name:', shelterName);
          setShelter(null);
        }
      }
    } catch (error) {
      console.error('Error fetching shelter details:', error);
      setShelter(null);
    } finally {
      setShelterLoading(false);
    }
  }, []); // No external dependencies, so an empty array is correct

  const loadSimilarAnimals = useCallback(async (currentAnimal) => {
    try {
      const allAnimals = await Animal.list('-created_date', 20);
      const filtered = allAnimals
        .filter(a => a.id !== currentAnimal.id && a.species === currentAnimal.species && a.is_active !== false)
        .slice(0, 4);
      setSimilarAnimals(filtered);
    } catch (error) {
      console.error('Error loading similar animals:', error);
      setSimilarAnimals([]);
    }
  }, []); // No external dependencies, so an empty array is correct

  const loadAnimalData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const searchParams = new URLSearchParams(location.search);
      const animalId = searchParams.get('id');
      
      if (!animalId) {
        setError('Hiányzó állat azonosító');
        return;
      }

      console.log('Loading animal with ID:', animalId);
      const fetchedAnimal = await Animal.get(animalId);
      console.log('Fetched animal:', fetchedAnimal);
      
      if (!fetchedAnimal) {
        setError('Állat nem található');
        return;
      }
      
      setAnimal(fetchedAnimal);

      // Menhely betöltése név alapján, NEM ID alapján
      if (fetchedAnimal.shelter_name) {
        console.log('Loading shelter by name:', fetchedAnimal.shelter_name);
        await loadShelterByName(fetchedAnimal.shelter_name);
      }

      // Hasonló állatok betöltése
      await loadSimilarAnimals(fetchedAnimal);
      
    } catch (error) {
      console.error('Error loading animal data:', error);
      setError(`Hiba az állat adatainak betöltésekor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [location.search, loadShelterByName, loadSimilarAnimals]); // Depend on location.search, and memoized functions

  useEffect(() => {
    loadAnimalData();
    loadUser();
  }, [loadAnimalData, loadUser]); // Depend on memoized functions

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${animal.name} örökbefogadása`,
          text: `Segíts megtalálni ${animal.name} új otthonát!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Itt lehetne egy toast üzenetet mutatni
      }
    } catch (error) {
      console.log('Sharing failed:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hiba történt</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to={createPageUrl('Animals')}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza az állatokhoz
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !animal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link to={createPageUrl('Animals')}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Megosztás
          </Button>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery photos={animal.photos} animalName={animal.name} />
            <AnimalHeader animal={animal} />
            <AnimalMeta animal={animal} />
            <DescriptionSection animal={animal} />
            <PropertiesSection animal={animal} />
            <AdoptionProcess />
            <FaqSection />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <ActionButtons animal={animal} user={user} />
            
            {shelterLoading ? (
              <Skeleton className="h-48 w-full rounded-2xl" />
            ) : shelter ? (
              <ShelterInfoCard shelter={shelter} />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <p className="text-sm text-yellow-800">
                  Menhely információ nem elérhető
                </p>
              </div>
            )}
            
            <DonationSidebar shelterName={animal.shelter_name} />
          </div>
        </div>

        {/* Similar Animals */}
        {similarAnimals.length > 0 && (
          <div className="mt-16">
            <SimilarAnimals animals={similarAnimals} />
          </div>
        )}
      </div>
    </div>
  );
}
