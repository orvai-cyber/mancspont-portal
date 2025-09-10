import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Star, 
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceCard = ({ provider, index }) => {
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
      className="h-full"
    >
      <Link to={createPageUrl(`ServiceProviderDetails?id=${provider.id}`)} className="h-full block">
        <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white border-slate-200/80 rounded-2xl overflow-hidden">
          {/* Kép konténer */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={provider.main_photo_url || `https://placehold.co/400x300/e2e8f0/64748b/png?text=${encodeURIComponent(provider.name)}`}
              alt={provider.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm border-none shadow-sm">
                {categoryLabels[provider.category]}
              </Badge>
            </div>
            {provider.verified && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-none shadow-sm flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ellenőrzött
                </Badge>
              </div>
            )}
          </div>

          {/* Tartalom konténer */}
          <CardContent className="p-4 flex-grow flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-1">
              {provider.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3 flex-grow">
              {provider.tagline}
            </p>

            <div className="space-y-2 mt-auto">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                <span>{provider.location}, {provider.county}</span>
              </div>

              {provider.rating && (
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current shrink-0" />
                  <span className="font-semibold text-gray-800">{provider.rating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">
                    ({provider.review_count || 0} értékelés)
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;