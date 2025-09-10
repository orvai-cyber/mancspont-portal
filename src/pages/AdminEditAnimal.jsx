import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Animal } from '@/api/entities';
import AdminLayout from '@/components/admin/AdminLayout';
import AnimalForm from '@/components/admin/AnimalForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from "sonner";

export default function AdminEditAnimal() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [animal, setAnimal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.search);
  const action = urlParams.get('action') || 'create'; // Default to create if no action
  const animalId = urlParams.get('id');

  console.log('AdminEditAnimal - URL params:', { action, animalId, search: location.search });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Betöltjük a jelenlegi felhasználót
      const user = await User.me();
      setCurrentUser(user);
      console.log('Current user loaded:', user);

      if (action === 'edit') {
        if (!animalId) {
          setError('Állat szerkesztéséhez meg kell adni az állat azonosítóját.');
          return;
        }

        try {
          const allAnimals = await Animal.list();
          const foundAnimal = allAnimals.find(a => a.id === animalId);
          
          if (foundAnimal) {
            console.log('Found animal for editing:', foundAnimal);
            
            // Ellenőrizzük, hogy a menhely admin csak a saját állatait szerkesztheti
            if (user.shelter_name && user.role !== 'admin') {
              if (foundAnimal.shelter_name !== user.shelter_name) {
                setError('Nincs jogosultsága ennek az állatnak a szerkesztéséhez. Csak a saját menhelye állatait szerkesztheti.');
                return;
              }
            }
            
            setAnimal(foundAnimal);
          } else {
            setError(`Az állat nem található (ID: ${animalId}).`);
          }
        } catch (error) {
          console.error('Error loading animal:', error);
          setError('Hiba történt az állat betöltésekor.');
        }
      } else if (action === 'create') {
        console.log('Create mode - checking user permissions');
        // Új állat létrehozása esetén ellenőrizzük, hogy van-e jogosultsága
        if (user.shelter_name || user.role === 'admin') {
          setAnimal(null); // Új állat
          console.log('User has permission to create animals');
        } else {
          setError('Nincs jogosultsága állat létrehozásához. Kérjen hozzáférést az adminisztrátortól.');
        }
      } else {
        setError(`Ismeretlen művelet: "${action}". Csak "create" vagy "edit" művelet támogatott.`);
      }

    } catch (error) {
      console.error("Hiba az adatok betöltésekor:", error);
      setError(`Hiba történt az adatok betöltésekor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [animalId, action]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (animalData) => {
    setIsSubmitting(true);
    try {
      if (action === 'edit' && animal) {
        console.log('Updating animal:', animalData);
        const updatedAnimal = await Animal.update(animal.id, animalData);
        setAnimal(updatedAnimal);
        toast.success("Állat adatai sikeresen frissítve!");
      } else if (action === 'create') {
        console.log('Creating new animal:', animalData);
        const newAnimal = await Animal.create(animalData);
        toast.success("Állat sikeresen létrehozva!");
        // Redirect to edit mode for the new animal
        window.location.href = createPageUrl(`AdminEditAnimal?action=edit&id=${newAnimal.id}`);
      } else {
        toast.error("Ismeretlen művelet vagy hiányzó állat adatok.");
      }
    } catch (error) {
      console.error("Hiba az állat mentésekor:", error);
      toast.error(`Hiba történt a mentés során: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("AdminManageAnimals")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">
              {action === 'create' ? 'Új állat létrehozása' : 'Állat szerkesztése'}
            </h1>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Link to={createPageUrl("AdminManageAnimals")}>
              <Button variant="outline">
                Vissza az állatokhoz
              </Button>
            </Link>
            <Button onClick={loadData} variant="default">
              Újrapróbálás
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl("AdminManageAnimals")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {action === 'create' ? 'Új állat létrehozása' : `${animal?.name || 'Állat'} szerkesztése`}
            </h1>
            {action === 'edit' && animal && (
              <p className="text-gray-600">
                {animal.shelter_name} • {animal.species} • {animal.breed || 'Vegyes fajtájú'}
              </p>
            )}
          </div>
        </div>

        <AnimalForm 
          animal={animal} 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
          submitLabel={action === 'create' ? "Állat létrehozása" : "Változások mentése"}
        />
      </div>
    </AdminLayout>
  );
}