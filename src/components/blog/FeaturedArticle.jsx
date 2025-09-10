
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const categoryColors = {
  allattartas: 'bg-blue-100 text-blue-800',
  neveles: 'bg-orange-100 text-orange-800',
  egeszseg: 'bg-green-100 text-green-800',
  jogi_tudnivalok: 'bg-red-100 text-red-800',
  orokbefogadas: 'bg-purple-100 text-purple-800',
  tippek: 'bg-yellow-100 text-yellow-800',
};

const categoryLabels = {
    allattartas: 'Állattartás',
    neveles: 'Nevelés',
    egeszseg: 'Egészség',
    jogi_tudnivalok: 'Jogi tudnivalók',
    orokbefogadas: 'Örökbefogadás',
    tippek: 'Tippek & Trükkök'
};

export default function FeaturedArticle({ article, isLoading }) {
  if (isLoading) {
    return <Skeleton className="w-full h-[450px] rounded-3xl" />;
  }

  if (!article) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={createPageUrl(`ArticleDetails?id=${article.id}`)} className="block group">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-200">
          <img 
            src={article.featured_image} 
            alt={article.title}
            className="w-full h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-8 text-white w-full lg:w-3/4">
            <Badge className={`mb-4 text-sm ${categoryColors[article.category] || 'bg-gray-100'}`}>
              {categoryLabels[article.category] || article.category}
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:text-yellow-300 transition-colors">
              {article.title}
            </h2>
            <p className="text-lg text-gray-200 hidden md:block mb-6">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-6 text-sm font-medium">
              <span>Szerző: {article.author}</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.read_time} perc olvasás</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
