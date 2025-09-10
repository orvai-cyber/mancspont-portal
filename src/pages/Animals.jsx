
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Animal } from "@/api/entities";
import AnimalFilters from "../components/animals/AnimalFilters";
import AnimalCard from "../components/animals/AnimalCard";
import UrgentAnimalsSlider from "../components/animals/UrgentAnimalsSlider"; 
import { Skeleton } from "@/components/ui/skeleton";
import { PawPrint, LayoutGrid, List, Frown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    searchTerm: "",
    shelterName: "all", // Added shelterName filter
    species: "all",
    age: "all",
    size: "all",
    gender: "all",
    location: "",
    county: "all",
    tags: []
  });

  const loadAnimals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allAnimals = await Animal.list('-created_date');
      // Ensure allAnimals is an array, default to empty if not
      if (Array.isArray(allAnimals)) {
        // Csak az aktív állatok megjelenítése a frontenden
        const activeAnimals = allAnimals.filter(animal => animal.is_active !== false);
        setAnimals(activeAnimals);
      } else {
        console.warn("Received non-array data for animals:", allAnimals);
        setAnimals([]); // Set to empty array to prevent issues
      }
    } catch (error) {
      console.error("Error loading animals:", error);
      setError("Hiba történt az állatok betöltésekor. Kérjük próbáld újra.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  // Optimalizált sürgős állatok memoizálása
  const urgentAnimals = useMemo(() => {
    // Ensure animals is an array before filtering
    return (animals || [])
      .filter(animal => animal.is_urgent)
      .sort(() => 0.5 - Math.random())
      .slice(0, 8); // Limit az első 8 sürgős állatra
  }, [animals]);

  // Optimalizált szűrés memoizálással
  const filteredAnimals = useMemo(() => {
    // First, filter out invalid animals
    const validAnimals = (animals || []).filter(animal => 
      animal && 
      typeof animal === 'object' &&
      animal.id && 
      animal.name && 
      typeof animal.name === 'string' &&
      animal.name.trim() !== '' &&
      animal.name !== 'undefined' && // Handles case where name might be string "undefined"
      animal.name !== 'null' // Handles case where name might be string "null"
    );

    return validAnimals.filter(animal => {
      const searchMatch = !filters.searchTerm || 
                          animal.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          (animal.breed && animal.breed.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      
      const shelterMatch = filters.shelterName === 'all' || animal.shelter_name === filters.shelterName; // New shelter filter
      const speciesMatch = filters.species === 'all' || animal.species === filters.species;
      const ageMatch = filters.age === 'all' || animal.age === filters.age;
      const sizeMatch = filters.size === 'all' || animal.size === filters.size;
      const genderMatch = filters.gender === 'all' || animal.gender === filters.gender;
      const locationMatch = !filters.location || (animal.location && animal.location.toLowerCase().includes(filters.location.toLowerCase()));
      const countyMatch = filters.county === 'all' || animal.county === filters.county;
      
      const tagsMatch = filters.tags.length === 0 || filters.tags.every(tag => {
        if (tag === 'special_needs') return animal.is_special_needs;
        if (tag === 'urgent') return animal.is_urgent;
        // Ensure animal.personality is an array before checking includes
        return (animal.personality || []).includes(tag);
      });

      return searchMatch && shelterMatch && speciesMatch && ageMatch && sizeMatch && genderMatch && locationMatch && countyMatch && tagsMatch;
    });
  }, [animals, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      shelterName: "all", // Reset shelterName
      species: "all",
      age: "all",
      size: "all",
      gender: "all",
      location: "",
      county: "all",
      tags: []
    });
  }, []);

  // Error állapot kezelése
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Hiba történt</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadAnimals} variant="outline">Újrapróbálás</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <PawPrint className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Találd meg új családtagodat
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Böngéssz az örökbefogadható kedvencek között és találd meg a hozzád leginkább illő társat.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Mobile Filter Accordion */}
          <div className="lg:hidden">
            <Accordion type="single" collapsible className="w-full bg-gray-50/70 rounded-xl p-2 border">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="px-4 py-2 text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="w-5 h-5 text-green-600" />
                    <span>Szűrés</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <AnimalFilters 
                    filters={filters} 
                    onFilterChange={handleFilterChange}
                    onReset={resetFilters}
                    resultsCount={filteredAnimals.length}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <AnimalFilters 
                filters={filters} 
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                resultsCount={filteredAnimals.length}
              />
            </div>
          </aside>

          {/* Results */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                <span className="text-green-600 font-bold">{filteredAnimals.length}</span> kiskedvenc vár gazdára
              </h2>
              <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg ${viewMode === 'grid' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                  aria-label="Rács nézet"
                >
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg ${viewMode === 'list' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                  aria-label="Lista nézet"
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className={`rounded-2xl ${viewMode === 'grid' ? 'h-96' : 'h-48'}`} />
                ))}
              </div>
            ) : filteredAnimals.length > 0 ? (
              <motion.div layout className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                <AnimatePresence>
                  {filteredAnimals.map(animal => (
                    <motion.div layout animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }} key={animal.id}>
                      <AnimalCard animal={animal} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Nincs találat</h3>
                <p className="text-gray-600 mb-6">Sajnos nem találtunk a szűrési feltételeknek megfelelő állatot.</p>
                <Button onClick={resetFilters} variant="outline">Szűrők törlése</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
