
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Shelter, Animal } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ShelterFilters from "../components/shelters/ShelterFilters";
import ShelterCard from "../components/shelters/ShelterCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, LayoutGrid, MapPin, Frown, SlidersHorizontal, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SheltersPage() {
  const [shelters, setShelters] = useState([]);
  const [sheltersWithStats, setSheltersWithStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    searchTerm: "",
    location: "",
    county: "all",
    capacity: "all",
    foundation: "all",
    shelterName: "all", // Added new filter
    sortBy: "name"
  });

  const loadShelters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Párhuzamos betöltés optimalizálása
      const [allShelters, allAnimals] = await Promise.all([
        Shelter.list('-created_date'),
        Animal.list()
      ]);

      // Állatokat menhelyenként csoportosítjuk
      const animalsByShelter = allAnimals.reduce((acc, animal) => {
        const shelterName = animal.shelter_name;
        if (!acc[shelterName]) {
          acc[shelterName] = [];
        }
        acc[shelterName].push(animal);
        return acc;
      }, {});

      // Menhelyek statisztikákkal bővítése
      const enrichedShelters = allShelters.map(shelter => {
        const animals = animalsByShelter[shelter.name] || [];
        return {
          ...shelter,
          currentAnimalsCount: animals.length,
          urgentAnimalsCount: animals.filter(a => a.is_urgent).length
        };
      });
      
      setShelters(allShelters);
      setSheltersWithStats(enrichedShelters);
    } catch (error) {
      console.error("Error loading shelters:", error);
      setError("Hiba történt a menhelyek betöltésekor. Kérjük próbáld újra.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShelters();
  }, [loadShelters]);

  // Optimalizált szűrés és rendezés
  const filteredShelters = useMemo(() => {
    let filtered = sheltersWithStats.filter(shelter => {
      const searchMatch = !filters.searchTerm || 
                          shelter.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          shelter.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const locationMatch = !filters.location || 
                           shelter.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const countyMatch = filters.county === 'all' || shelter.county === filters.county;
      
      const shelterNameMatch = filters.shelterName === 'all' || shelter.name === filters.shelterName; // Added new filter condition
      
      const capacityMatch = filters.capacity === 'all' || 
                           (filters.capacity === 'small' && shelter.capacity <= 50) ||
                           (filters.capacity === 'medium' && shelter.capacity > 50 && shelter.capacity <= 100) ||
                           (filters.capacity === 'large' && shelter.capacity > 100);
      
      const foundationMatch = filters.foundation === 'all' || 
                             (filters.foundation === 'new' && shelter.foundation_year >= 2015) ||
                             (filters.foundation === 'established' && shelter.foundation_year < 2015);

      return searchMatch && locationMatch && countyMatch && shelterNameMatch && capacityMatch && foundationMatch; // Included in return
    });

    // Rendezés alkalmazása
    if (filters.sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'capacity') {
      filtered.sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
    } else if (filters.sortBy === 'animals_helped') {
      filtered.sort((a, b) => (b.animals_helped || 0) - (a.animals_helped || 0));
    } else if (filters.sortBy === 'foundation') {
      filtered.sort((a, b) => (b.foundation_year || 0) - (a.foundation_year || 0));
    }

    return filtered;
  }, [sheltersWithStats, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      location: "",
      county: "all",
      capacity: "all",
      foundation: "all",
      shelterName: "all", // Added new filter to reset
      sortBy: "name"
    });
  }, []);

  // Error állapot kezelése
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Hiba történt</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadShelters} variant="outline">Újrapróbálás</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Heart className="w-12 h-12 text-orange-100 mx-auto mb-4" />
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Partner menhelyek
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl mx-auto leading-relaxed">
            Ismerd meg azokat a menhelyeket, akik nap mint nap dolgoznak az állatmentésért és gondoskodnak az örökbefogadásra váró állatokról.
          </p>
          <div className="flex justify-center gap-8 mt-8 text-orange-100">
            <div className="text-center">
              <div className="text-2xl font-bold">{shelters.length}+</div>
              <div className="text-sm">Partner menhely</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2,500+</div>
              <div className="text-sm">Mentett állat</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm">Megye</div>
            </div>
          </div>
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
                    <SlidersHorizontal className="w-5 h-5 text-orange-600" />
                    <span>Szűrés</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <ShelterFilters 
                    filters={filters} 
                    onFilterChange={handleFilterChange}
                    onReset={resetFilters}
                    resultsCount={filteredShelters.length}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <ShelterFilters 
                filters={filters} 
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                resultsCount={filteredShelters.length}
              />
            </div>
          </aside>

          {/* Results */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                <span className="text-orange-600 font-bold">{filteredShelters.length}</span> menhely található
              </h2>
              <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg ${viewMode === 'grid' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                  aria-label="Rács nézet"
                >
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode('map')}
                  className={`rounded-lg ${viewMode === 'map' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                  aria-label="Térkép nézet"
                >
                  <MapPin className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="rounded-2xl h-80" />
                ))}
              </div>
            ) : filteredShelters.length > 0 ? (
              <>
                <motion.div layout className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence>
                    {filteredShelters.map(shelter => (
                      <motion.div layout animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }} key={shelter.id}>
                        <ShelterCard shelter={shelter} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Menhely CTA Kártya */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-16"
                >
                  <div className="bg-gradient-to-br from-green-400/20 to-green-500/30 backdrop-blur-sm p-6 md:p-8 lg:p-12 rounded-3xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="max-w-4xl mx-auto text-center">
                      <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 shadow-lg">
                        <Home className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                      </div>
                      
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                        Mutasd be a menhelyed a portálunkon
                      </h2>
                      
                      <p className="text-base sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Csatlakozz a közösséghez, és engedd, hogy még több gazdi találjon rá az örökbefogadásra váró állataidra. 
                        Nálunk minden menhely számára <strong className="text-black font-bold text-xl sm:text-2xl">INGYENES</strong> a megjelenés.
                      </p>

                      <Link to={createPageUrl("ServiceProviderApplication")}>
                        <Button 
                          className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 sm:px-10 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                          Jelentkezz menhelyként
                          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                        </Button>
                      </Link>
                      
                      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>100% ingyenes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Egyszerű regisztráció</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Több leendő gazdi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Nincs találat</h3>
                <p className="text-gray-600 mb-6">Sajnos nem találtunk a szűrési feltételeknek megfelelő menhelyet.</p>
                <Button onClick={resetFilters} variant="outline">Szűrők törlése</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
