
import React, { useState, useEffect, useMemo } from 'react';
import { Shelter, Animal } from '@/api/entities';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Building, Search, Frown } from 'lucide-react';
import ShelterListItem from '@/components/admin/ShelterListItem';
import { toast } from 'sonner';

export default function AdminManageShelters() {
  const [sheltersWithStats, setSheltersWithStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [sheltersData, animalsData] = await Promise.all([
          Shelter.list('-created_date'),
          Animal.list()
        ]);

        const animalCounts = animalsData.reduce((acc, animal) => {
          if (animal.shelter_name) {
            acc[animal.shelter_name] = (acc[animal.shelter_name] || 0) + 1;
          }
          return acc;
        }, {});

        const sheltersWithAnimalCounts = sheltersData.map(shelter => ({
          ...shelter,
          animalCount: animalCounts[shelter.name] || 0,
        }));

        setSheltersWithStats(sheltersWithAnimalCounts);
      } catch (error) {
        console.error("Hiba a menhelyek betöltésekor:", error);
        toast.error("Hiba történt a menhelyek betöltésekor.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredShelters = useMemo(() => {
    return sheltersWithStats.filter(shelter => {
      const name = shelter.name || '';
      const location = shelter.location || '';
      const county = shelter.county || '';
      
      return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             location.toLowerCase().includes(searchTerm.toLowerCase()) ||
             county.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [sheltersWithStats, searchTerm]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Menhelyek kezelése</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Menhelyek ({filteredShelters.length})
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Keresés név, város, megye alapján..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
              </div>
            ) : filteredShelters.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Frown className="w-12 h-12 mx-auto mb-2" />
                <p>Nincsenek a keresésnek megfelelő menhelyek.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredShelters.map(shelter => (
                  <ShelterListItem key={shelter.id} shelter={shelter} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
