import React, { useState, useEffect } from 'react';
import { User, Shelter } from '@/api/entities';
import AdminLayout from '@/components/admin/AdminLayout';
import ShelterForm from '@/components/admin/ShelterForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from "sonner";

export default function AdminMyShelter() {
  const [user, setUser] = useState(null);
  const [shelter, setShelter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      if (currentUser && currentUser.shelter_name) {
        const [exactMatch, allShelters] = await Promise.all([
          Shelter.filter({ name: currentUser.shelter_name }),
          Shelter.list()
        ]);
        
        if (exactMatch.length > 0) {
          setShelter(exactMatch[0]);
        } else {
          // Case-insensitive keresés
          const caseInsensitiveMatch = allShelters.find(s => 
            s.name.toLowerCase() === currentUser.shelter_name.toLowerCase()
          );
          
          if (caseInsensitiveMatch) {
            setShelter(caseInsensitiveMatch);
          }
        }
      } else {
        setShelter(null);
      }
    } catch (error) {
      console.error("Hiba a menhely adatainak betöltésekor:", error);
      toast.error("Hiba történt a menhely adatainak betöltésekor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (shelterData) => {
    setIsSubmitting(true);
    try {
      if (shelter) {
        const updatedShelter = await Shelter.update(shelter.id, shelterData);
        setShelter(updatedShelter);
        toast.success("Menhely adatai sikeresen frissítve!");
      } else {
        const newShelter = await Shelter.create(shelterData);
        
        // Frissítjük a felhasználó adatait
        await User.updateMyUserData({ 
          shelter_name: newShelter.name,
          can_create_shelter: false 
        });
        
        setShelter(newShelter);
        setUser(prev => ({...prev, shelter_name: newShelter.name, can_create_shelter: false}));
        toast.success("Menhely sikeresen létrehozva!");
      }
    } catch (error) {
      console.error("Hiba a menhely mentésekor:", error);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Figyelmeztetések */}
        {!user?.shelter_name && !user?.can_create_shelter && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Nincs menhelyhez rendelve és nincs jogosultsága új menhely létrehozásához. 
              Kérjen hozzáférést az adminisztrátortól.
            </AlertDescription>
          </Alert>
        )}

        {user?.shelter_name && !shelter && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              A felhasználói fiókjához "{user.shelter_name}" menhely van rendelve, 
              de ez a menhely nem található az adatbázisban. Ellenőrizze a névírást vagy 
              hozza létre újra a menhelyet.
            </AlertDescription>
          </Alert>
        )}

        <ShelterForm 
          shelter={shelter} 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
          submitLabel={shelter ? "Adatok frissítése" : "Menhely létrehozása"}
        />
      </div>
    </AdminLayout>
  );
}