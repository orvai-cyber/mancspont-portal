import React, { useState, useEffect, useCallback } from 'react';
import { ServiceProvider } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { MapPin, Star, Phone, CheckCircle } from 'lucide-react';

const SimilarProviderCard = ({ provider, index }) => {
  const categoryLabels = {
    panzio: 'Kutyapanzió',
    napköz: 'Kutyanapközi',
    iskola: 'Kutyaiskola',
    szitter: 'Szitter'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={createPageUrl(`ServiceProviderDetails?id=${provider.id}`)}>
        <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white border-slate-200/80 rounded-2xl overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={provider.main_photo_url || `https://placehold.co/400x300/e2e8f0/cccccc/png?text=${provider.name}`}
              alt={provider.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm border-none shadow-sm">
                {categoryLabels[provider.category]}
              </Badge>
            </div>
            {provider.verified && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-none shadow-sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ellenőrzött
                </Badge>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardContent className="p-6">
            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-1">
                {provider.name}
              </h3>
              {provider.tagline && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {provider.tagline}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {/* Hely */}
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span>{provider.location}, {provider.county}</span>
              </div>

              {/* Értékelés */}
              {provider.rating && (
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                  <span className="font-semibold text-gray-800">{provider.rating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">
                    ({provider.review_count || 0} értékelés)
                  </span>
                </div>
              )}

              {/* Telefon */}
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span>{provider.phone}</span>
              </div>

              {/* Szolgáltatások */}
              {provider.services_offered && provider.services_offered.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1">
                    {provider.services_offered.slice(0, 3).map(service => (
                      <Badge key={service} variant="secondary" className="text-xs px-2 py-1">
                        {service}
                      </Badge>
                    ))}
                    {provider.services_offered.length > 3 && (
                      <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-200 text-gray-600">
                        +{provider.services_offered.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function SimilarProviders({ currentProvider }) {
  const [similarProviders, setSimilarProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryLabels = {
    panzio: 'Kutyapanziók',
    napköz: 'Kutyanapközik',
    iskola: 'Kutyaiskolák',
    szitter: 'Szitterek'
  };

  const loadSimilarProviders = useCallback(async () => {
    if (!currentProvider) return;
    
    setIsLoading(true);
    try {
      const allProviders = await ServiceProvider.list();
      
      // Kizárjuk az aktuális szolgáltatót és csak ugyanabból a kategóriából szűrünk
      const filteredProviders = allProviders.filter(provider => 
        provider.id !== currentProvider.id && 
        provider.category === currentProvider.category
      );

      // Prioritási rendszer: 1. Ugyanaz a város, 2. Ugyanaz a megye, 3. Random
      const sameCity = filteredProviders.filter(provider => 
        provider.location === currentProvider.location
      );
      
      const sameCounty = filteredProviders.filter(provider => 
        provider.county === currentProvider.county && 
        provider.location !== currentProvider.location
      );
      
      const others = filteredProviders.filter(provider => 
        provider.county !== currentProvider.county
      );

      // Random keverés az "others" csoportban
      const shuffledOthers = others.sort(() => 0.5 - Math.random());
      
      // Összeállítjuk a végső listát prioritás szerint, max 6 elem
      const finalList = [
        ...sameCity,
        ...sameCounty,
        ...shuffledOthers
      ].slice(0, 6);

      setSimilarProviders(finalList);
    } catch (error) {
      console.error('Error loading similar providers:', error);
      setSimilarProviders([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentProvider]);

  useEffect(() => {
    loadSimilarProviders();
  }, [loadSimilarProviders]);

  if (!currentProvider || (!isLoading && similarProviders.length === 0)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-16"
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            Hasonló {categoryLabels[currentProvider.category] || 'Szolgáltatók'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProviders.map((provider, index) => (
                <SimilarProviderCard 
                  key={provider.id} 
                  provider={provider} 
                  index={index}
                />
              ))}
            </div>
          )}
          
          {!isLoading && similarProviders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium">Nem található hasonló szolgáltató</p>
              <p className="text-sm">Jelenleg nincs másik {categoryLabels[currentProvider.category]?.toLowerCase()} a rendszerben.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}