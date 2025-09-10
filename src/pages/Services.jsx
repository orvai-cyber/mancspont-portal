
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ServiceProvider } from '@/api/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown, SlidersHorizontal, Home, ArrowRight, Sun, School, UserCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import ServiceHero from '../components/services/ServiceHero';
import ServiceCard from '../components/services/ServiceCard';
import ServiceFilters from '../components/services/ServiceFilters';

const categoryConfig = {
  panzio: { name: 'Kutyapanziók', icon: 'Home' },
  napköz: { name: 'Kutyanapközik', icon: 'Sun' },
  iskola: { name: 'Kutyaiskolák', icon: 'School' },
  szitter: { name: 'Szitterek', icon: 'UserCheck' }
};

export default function ServicesPage() {
  const location = useLocation();
  const [allProviders, setAllProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('panzio');
  const [filters, setFilters] = useState({
    searchTerm: '',
    location: '', // Added new filter field
    county: 'all',
    priceLevel: 'all',
    minRating: 0,
    services: []
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category && categoryConfig[category]) {
      setActiveCategory(category);
    }
  }, [location.search]);

  useEffect(() => {
    const loadProviders = async () => {
      setIsLoading(true);
      try {
        const providers = await ServiceProvider.list('-created_date');
        setAllProviders(providers);
      } catch (error) {
        console.error("Error loading service providers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProviders();
  }, []);
  
  const filteredProviders = useMemo(() => {
    return allProviders.filter(p => {
      const categoryMatch = p.category === activeCategory;
      const searchMatch = filters.searchTerm === '' || p.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      // Fixed locationMatch
      const locationMatch = filters.location === '' || !filters.location || p.location.toLowerCase().includes(filters.location.toLowerCase()); 
      const countyMatch = !filters.county || filters.county === 'all' || p.county === filters.county; // Fixed county logic
      const priceMatch = filters.priceLevel === 'all' || p.price_level === filters.priceLevel;
      const ratingMatch = p.rating >= filters.minRating;
      const servicesMatch = filters.services.length === 0 || (p.services_offered && filters.services.every(s => p.services_offered.includes(s)));

      return categoryMatch && searchMatch && locationMatch && countyMatch && priceMatch && ratingMatch && servicesMatch;
    });
  }, [allProviders, activeCategory, filters]);
  
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      location: '', // Added new filter field to reset
      county: 'all',
      priceLevel: 'all',
      minRating: 0,
      services: []
    });
  };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <ServiceHero 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryConfig={categoryConfig}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <aside className="lg:col-span-1">
            <div className="lg:hidden">
                <Accordion type="single" collapsible className="w-full bg-white rounded-xl p-2 border">
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="px-4 py-2 text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                        <span>Szűrés & Rendezés</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <ServiceFilters 
                          filters={filters}
                          onFilterChange={setFilters}
                          onReset={resetFilters}
                          resultsCount={filteredProviders.length}
                          activeCategory={activeCategory}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </div>
            <div className="hidden lg:block sticky top-24">
              <ServiceFilters 
                filters={filters}
                onFilterChange={setFilters}
                onReset={resetFilters}
                resultsCount={filteredProviders.length}
                activeCategory={activeCategory}
              />
            </div>
          </aside>

          <main className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {categoryConfig[activeCategory].name} <span className="text-gray-400 font-medium">({filteredProviders.length} találat)</span>
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-2xl" />)}
              </div>
            ) : filteredProviders.length > 0 ? (
              <>
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredProviders.map((provider, index) => (
                      <motion.div layout animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }} key={provider.id}>
                        <ServiceCard provider={provider} index={index} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Kutyapanzió CTA Kártya - Csak panzió kategóriánál */}
                {activeCategory === 'panzio' && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16"
                  >
                    <div className="bg-gradient-to-br from-indigo-400/20 to-purple-500/30 backdrop-blur-sm p-6 md:p-8 lg:p-12 rounded-3xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                          <Home className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                          Legyen a te panziód is a listában
                        </h2>
                        
                        <p className="text-base sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                          Ha te biztosítasz biztonságos helyet a gazdik kedvenceinek, jelenj meg nálunk, hogy könnyen rád találjanak, amikor szükségük van rád.
                        </p>

                        <Link to={createPageUrl("ServiceProviderApplication")}>
                          <Button 
                            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-6 py-3 sm:px-10 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <Home className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                            Jelentkezz kutyapanzióként
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                          </Button>
                        </Link>
                        
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Egyszerű regisztráció</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Célzott közönség</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Növekvő láthatóság</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Kutyanapközi CTA Kártya - Csak napközi kategóriánál */}
                {activeCategory === 'napköz' && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16"
                  >
                    <div className="bg-gradient-to-br from-indigo-400/20 to-purple-500/30 backdrop-blur-sm p-6 md:p-8 lg:p-12 rounded-3xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                          <Sun className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                          Tedd láthatóvá napközid a gazdik számára
                        </h2>
                        
                        <p className="text-base sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                          Ha te gondoskodsz a kutyákról napközben, itt a helyed. Nálunk a gazdik egyszerűen rád találhatnak, amikor felügyeletet keresnek.
                        </p>

                        <Link to={createPageUrl("ServiceProviderApplication")}>
                          <Button 
                            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-6 py-3 sm:px-10 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <Sun className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                            Jelentkezz kutyanapköziként
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                          </Button>
                        </Link>
                        
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Egyszerű regisztráció</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Célzott közönség</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Növekvő láthatóság</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Kutyaiskola CTA Kártya - Csak iskola kategóriánál */}
                {activeCategory === 'iskola' && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16"
                  >
                    <div className="bg-gradient-to-br from-indigo-400/20 to-purple-500/30 backdrop-blur-sm p-6 md:p-8 lg:p-12 rounded-3xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                          <School className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                          Legyen a kutyaiskolád is a portál része
                        </h2>
                        
                        <p className="text-base sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                          Ha te tanítod és neveled a kutyákat, jelenj meg nálunk, hogy azok a gazdik is megtaláljanak, akik éppen képzést keresnek kedvencüknek.
                        </p>

                        <Link to={createPageUrl("ServiceProviderApplication")}>
                          <Button 
                            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-6 py-3 sm:px-10 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <School className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                            Jelentkezzen kutyaiskolaként
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                          </Button>
                        </Link>
                        
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Egyszerű regisztráció</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Célzott közönség</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Növekvő láthatóság</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Szitter CTA Kártya - Csak szitter kategóriánál */}
                {activeCategory === 'szitter' && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16"
                  >
                    <div className="bg-gradient-to-br from-indigo-400/20 to-purple-500/30 backdrop-blur-sm p-6 md:p-8 lg:p-12 rounded-3xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                          <UserCheck className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                          Legyen a szitter szolgáltatásod elérhető nálunk
                        </h2>
                        
                        <p className="text-base sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                          Ha te vagy az, aki gondoskodik a kutyáról, amikor a gazdi nem ér rá, regisztrálj, és engedd, hogy a gazdik könnyen megtaláljanak.
                        </p>

                        <Link to={createPageUrl("ServiceProviderApplication")}>
                          <Button 
                            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-6 py-3 sm:px-10 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                            Jelentkezz szitterként
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                          </Button>
                        </Link>
                        
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Egyszerű regisztráció</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Célzott közönség</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Növekvő láthatóság</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border">
                <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Nincs találat</h3>
                <p className="text-gray-600 mb-6">Sajnos nem találtunk a szűrési feltételeknek megfelelő szolgáltatót.</p>
                <Button onClick={resetFilters} variant="outline">Szűrők törlése</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
