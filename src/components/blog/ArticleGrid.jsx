import React from 'react';
import ArticleCard, { ArticleCardSkeleton } from './ArticleCard';
import { Frown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ArticleGrid({ articles, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => <ArticleCardSkeleton key={i} />)}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl">
        <Frown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800">Nincsenek cikkek</h3>
        <p className="text-gray-500">Ebben a kategóriában még nincsenek cikkek.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <AnimatePresence>
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}