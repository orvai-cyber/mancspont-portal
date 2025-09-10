import React, { useState, useEffect } from 'react';
import { Article } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryColors = {
  allattartas: 'bg-blue-100 text-blue-800',
  neveles: 'bg-orange-100 text-orange-800',
  egeszseg: 'bg-green-100 text-green-800',
  jogi_tudnivalok: 'bg-red-100 text-red-800',
  orokbefogadas: 'bg-purple-100 text-purple-800',
  tippek: 'bg-yellow-100 text-yellow-800',
};

export default function RelatedArticles({ currentArticle }) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRelatedArticles = async () => {
      if (!currentArticle) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Get articles from the same category first
        const sameCategory = await Article.filter(
          { category: currentArticle.category, published: true }, 
          '-created_date', 
          6
        );
        
        // Filter out the current article
        const filtered = sameCategory.filter(article => article.id !== currentArticle.id);
        
        // If we don't have enough articles from the same category, get more from other categories
        if (filtered.length < 3) {
          const moreArticles = await Article.filter(
            { published: true }, 
            '-created_date', 
            6
          );
          const additionalArticles = moreArticles
            .filter(article => article.id !== currentArticle.id && !filtered.find(f => f.id === article.id))
            .slice(0, 3 - filtered.length);
          
          filtered.push(...additionalArticles);
        }

        setArticles(filtered.slice(0, 3));
      } catch (error) {
        console.error('Error loading related articles:', error);
        setArticles([]);
      }
      setIsLoading(false);
    };

    loadRelatedArticles();
  }, [currentArticle]);

  if (isLoading || articles.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="border-t-2 border-gray-100 pt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Hasonló cikkek, amiket szintén érdemes elolvasni
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            >
              <Link to={createPageUrl(`ArticleDetails?id=${article.id}`)} className="block group h-full">
                <Card className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden bg-white h-full flex flex-col">
                  <img 
                    src={article.featured_image}
                    alt={article.title}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <Badge variant="secondary" className={`capitalize w-fit mb-3 ${categoryColors[article.category] || 'bg-gray-100'}`}>
                      {article.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex-grow group-hover:text-green-700 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.read_time} perc</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 group-hover:gap-2 transition-all">
                        <span className="text-sm font-medium">Elolvasom</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}