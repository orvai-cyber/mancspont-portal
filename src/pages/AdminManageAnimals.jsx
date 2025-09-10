
import React, { useState, useEffect, useCallback } from 'react';
import { Animal, User } from '@/api/entities';
import AdminLayout from '@/components/admin/AdminLayout';
import AnimalListItem from '@/components/admin/AnimalListItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Filter, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge'; // New import for Badge

export default function AdminManageAnimals() {
  const [currentUser, setCurrentUser] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('aktiv'); // Új tab state

  const loadAnimals = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      let animalsList = [];
      
      if (user.role === 'admin') {
        // Site admin: minden állatot lát
        animalsList = await Animal.list('-created_date');
      } else if (user.shelter_name) {
        // Menhely admin: csak a saját menhely állatait látja
        animalsList = await Animal.filter({ shelter_name: user.shelter_name }, '-created_date');
      } else {
        // Nincs jogosultsága
        animalsList = [];
      }
      
      setAnimals(animalsList);
      setFilteredAnimals(animalsList);
    } catch (error) {
      console.error("Hiba az állatok betöltésekor:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  useEffect(() => {
    let filtered = animals;

    // Tab szűrés hozzáadása
    if (activeTab === 'aktiv') {
      filtered = filtered.filter(animal => animal.is_active !== false);
    } else if (activeTab === 'orokbefogadottak') {
      filtered = filtered.filter(animal => animal.is_active === false);
    }

    // Keresés alkalmazása
    if (searchTerm) {
      filtered = filtered.filter(animal =>
        animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.shelter_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Faj szűrés
    if (selectedSpecies !== 'all') {
      filtered = filtered.filter(animal => animal.species === selectedSpecies);
    }

    // Státusz szűrés
    if (selectedStatus === 'urgent') {
      filtered = filtered.filter(animal => animal.is_urgent);
    } else if (selectedStatus === 'special_needs') {
      filtered = filtered.filter(animal => animal.is_special_needs);
    }

    setFilteredAnimals(filtered);
  }, [animals, searchTerm, selectedSpecies, selectedStatus, activeTab]); // activeTab hozzáadása

  const handleAnimalDeleted = (animalId) => {
    setAnimals(prev => prev.filter(animal => animal.id !== animalId));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSpecies('all');
    setSelectedStatus('all');
  };

  // Ellenőrizzük a jogosultságokat
  if (!isLoading && currentUser && !currentUser.shelter_name && currentUser.role !== 'admin') {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nincs jogosultság</h2>
            <p className="text-gray-600">
              Csak menhely adminok és site adminok férhetnek hozzá az állatok kezeléséhez.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Állatok kezelése</h1>
            {currentUser?.shelter_name && currentUser.role !== 'admin' && (
              <p className="text-gray-600 mt-1">
                {currentUser.shelter_name} • {filteredAnimals.length} állat ({activeTab === 'aktiv' ? 'aktív' : 'örökbefogadott'})
              </p>
            )}
            {currentUser?.role === 'admin' && (
              <p className="text-gray-600 mt-1">
                Összes menhely • {filteredAnimals.length} állat ({activeTab === 'aktiv' ? 'aktív' : 'örökbefogadott'})
              </p>
            )}
          </div>
          <Link to={createPageUrl('AdminEditAnimal?action=create')}>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Új állat felvétele
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { 
                key: 'aktiv', 
                label: 'Aktív állatok', 
                count: animals.filter(a => a.is_active !== false).length 
              },
              { 
                key: 'orokbefogadottak', 
                label: 'Örökbefogadottak', 
                count: animals.filter(a => a.is_active === false).length 
              }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <Badge variant={activeTab === tab.key ? 'default' : 'secondary'} className="text-xs">
                  {tab.count}
                </Badge>
              </button>
            ))}
          </nav>
        </div>

        {/* Biztonsági figyelmeztetés site adminoknak */}
        {currentUser?.role === 'admin' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Site admin mód:</strong> Minden menhely állatait látod és szerkesztheted. 
              Legyél óvatos a módosításokkal!
            </AlertDescription>
          </Alert>
        )}

        {/* Szűrők */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Keresés név, fajta vagy menhely szerint..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Faj" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Minden faj</SelectItem>
              <SelectItem value="kutya">Kutya</SelectItem>
              <SelectItem value="macska">Macska</SelectItem>
              <SelectItem value="nyúl">Nyúl</SelectItem>
              <SelectItem value="madár">Madár</SelectItem>
              <SelectItem value="egyéb">Egyéb</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Státusz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Minden státusz</SelectItem>
              <SelectItem value="urgent">Sürgős esetek</SelectItem>
              <SelectItem value="special_needs">Speciális gondozás</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetFilters}>
            <Filter className="w-4 h-4 mr-2" />
            Szűrők törlése
          </Button>
        </div>

        {/* Állatok listája */}
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : filteredAnimals.length > 0 ? (
          <div className="space-y-4">
            {filteredAnimals.map(animal => (
              <AnimalListItem
                key={animal.id}
                animal={animal}
                onDeleted={handleAnimalDeleted}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-500">
              {animals.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium mb-2">Még nincsenek állatok</h3>
                  <p className="mb-4">Add fel az első állatot, aki örökbefogadásra vár!</p>
                  <Link to={createPageUrl('AdminEditAnimal?action=create')}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Első állat felvétele
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-2">
                    {activeTab === 'aktiv' ? 'Nincs aktív állat' : 'Nincs örökbefogadott állat'}
                  </h3>
                  <p className="mb-4">
                    {activeTab === 'aktiv' 
                      ? 'Próbáld meg módosítani a keresési feltételeket.' 
                      : 'Még nincsenek örökbefogadott állatok.'
                    }
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Szűrők törlése
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
