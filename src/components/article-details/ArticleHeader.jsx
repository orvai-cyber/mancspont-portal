import React from 'react';
import { Badge } from '@/components/ui/badge';
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

export default function ArticleHeader({ article }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Badge className={`mb-4 text-sm ${categoryColors[article.category] || 'bg-gray-100'}`}>
        {categoryLabels[article.category] || article.category}
      </Badge>
      <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        {article.title}
      </h1>
      <p className="text-xl text-gray-600 leading-relaxed mb-8">
        {article.excerpt}
      </p>
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <img 
          src={article.featured_image}
          alt={article.title}
          className="w-full h-96 object-cover"
        />
      </div>
    </motion.header>
  );
}