
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Shelter } from '@/api/entities';
import AdminLayout from '@/components/admin/AdminLayout';
import ShelterForm from '@/components/admin/ShelterForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from "sonner";

export default function AdminEditShelter() {
  const location = useLocation();
  const [shelter, setShelter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.search);
  const shelterId = urlParams.get('id');
  const shelterName = urlParams.get('name');

  const loadShelter = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let foundShelter = null;

      // Próbáljuk meg ID alapján betölteni
      if (shelterId) {
        try {
          const allShelters = await Shelter.list();
          foundShelter = allShelters.find(s => s.id === shelterId);
        } catch (error) {
          // Silent fail, continue with name search
        }
      }

      // Ha ID alapján nem sikerült, próbáljuk név alapján
      if (!foundShelter && shelterName) {
        try {
          const sheltersByName = await Shelter.filter({ name: shelterName });
          if (sheltersByName.length > 0) {
            foundShelter = sheltersByName[0];
          } else {
            // Case-insensitive keresés
            const allShelters = await Shelter.list();
            foundShelter = allShelters.find(s => 
              s.name.toLowerCase() === shelterName.toLowerCase()
            );
          }
        } catch (error) {
          // Silent fail
        }
      }

      if (!foundShelter) {
        setError(`Menhely nem található. Keresett: ID="${shelterId}" vagy név="${shelterName}"`);
      } else {
        setShelter(foundShelter);
      }

    } catch (error) {
      console.error("Hiba a menhely betöltésekor:", error);
      setError(`Hiba történt a menhely betöltésekor: ${error.message}`);
      toast.error("Hiba történt a menhely betöltésekor.");
    } finally {
      setIsLoading(false);
    }
  }, [shelterId, shelterName]); // Removed location.search from dependencies

  useEffect(() => {
    loadShelter();
  }, [loadShelter]);

  const handleSubmit = async (shelterData) => {
    if (!shelter) {
      toast.error("Nincs betöltött menhely a frissítéshez.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedShelter = await Shelter.update(shelter.id, shelterData);
      setShelter(updatedShelter);
      toast.success("Menhely adatai sikeresen frissítve!");
    } catch (error) {
      console.error("Hiba a menhely frissítésekor:", error);
      toast.error(`Hiba történt a frissítés során: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("AdminManageShelters")}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Vissza a menhelyekhez
              </Button>
            </Link>
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-[500px] w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("AdminManageShelters")}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Vissza a menhelyekhez
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">
              {shelter ? `${shelter.name} szerkesztése` : 'Menhely szerkesztése'}
            </h1>
          </div>
        </div>

        {/* Hiba üzenetek */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!shelterId && !shelterName && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Hiányzó URL paraméterek. Az oldal "?id=..." vagy "?name=..." paramétereket vár.
            </AlertDescription>
          </Alert>
        )}

        {shelter ? (
          <ShelterForm 
            shelter={shelter} 
            onSubmit={handleSubmit} 
            isLoading={isSubmitting} 
            submitLabel="Adatok frissítése"
          />
        ) : (
          !isLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Menhely nem található</h3>
                <p className="text-gray-600 mb-4">
                  A keresett menhely nem található az adatbázisban.
                </p>
                <Link to={createPageUrl("AdminManageShelters")}>
                  <Button>
                    Vissza a menhelyek listájához
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </AdminLayout>
  );
}
