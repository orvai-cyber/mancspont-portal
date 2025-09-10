import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Article } from '@/api/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Search, Frown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import FeaturedArticle from '../components/blog/FeaturedArticle';
import ArticleGrid from '../components/blog/ArticleGrid';
import CategoryFilters from '../components/blog/CategoryFilters';
import TrendingPosts from '../components/blog/TrendingPosts';
import NewsletterCta from '../components/blog/NewsletterCta';

// Kategória konfiguráció centralizálása
const CATEGORY_CONFIG = {
  'all': { label: 'Minden cikk', color: 'bg-gray-100 text-gray-800' },
  'allattartas': { label: 'Állattartás', color: 'bg-green-100 text-green-800' },
  'neveles': { label: 'Nevelés', color: 'bg-blue-100 text-blue-800' },
  'egeszseg': { label: 'Egészség', color: 'bg-red-100 text-red-800' },
  'jogi_tudnivalok': { label: 'Jogi tudnivalók', color: 'bg-purple-100 text-purple-800' },
  'orokbefogadas': { label: 'Örökbefogadás', color: 'bg-orange-100 text-orange-800' },
  'tippek': { label: 'Tippek', color: 'bg-yellow-100 text-yellow-800' }
};

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedArticles = await Article.filter({ published: true }, '-created_date');
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error loading articles:", error);
      setError("Hiba történt a cikkek betöltésekor. Kérjük próbáld újra.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Featured article memoizálása
  const featuredArticle = useMemo(() => articles[0], [articles]);
  
  // Optimalizált szűrés és keresés
  const { filteredArticles, categories } = useMemo(() => {
    let filtered = articles.slice(1); // Kihagyjuk a kiemelt cikket
    
    // Kategória szűrés
    if (activeCategory !== 'all') {
      filtered = filtered.filter(article => article.category === activeCategory);
    }
    
    // Keresés alkalmazása
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.author.toLowerCase().includes(searchLower) ||
        (article.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Kategóriák automatikus detektálása
    const detectedCategories = ['all', ...Array.from(new Set(articles.map(article => article.category)))];
    
    return { 
      filteredArticles: filtered, 
      categories: detectedCategories 
    };
  }, [articles, activeCategory, searchTerm]);

  // Trending cikkek optimalizálása
  const trendingArticles = useMemo(() => 
    articles
      .slice(0, 8)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5), 
    [articles]
  );

  // Search kezelés optimalizálva
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Search results összegzés
    if (value.trim() !== '') {
      setSearchResults({
        term: value,
        count: filteredArticles.length
      });
    } else {
      setSearchResults(null);
    }
  }, [filteredArticles.length]);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setSearchTerm(''); // Reset search when changing category
    setSearchResults(null);
  }, []);

  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults(null);
    setActiveCategory('all');
  }, []);

  // Error állapot kezelése
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Hiba történt</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadArticles} variant="outline">Újrapróbálás</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-block p-4 bg-green-100 rounded-2xl mb-4">
            <BookOpen className="w-10 h-10 text-green-700" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Magazin a kedvenceinkről
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Cikkek, inspiráló történetek és hasznos tippek a kisállattartás világából.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Keresés cikkek között..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-12 pr-4 py-3 text-lg rounded-full border-2 border-gray-200 focus:border-green-500 focus:ring-green-500"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full text-gray-400 hover:text-gray-600"
              >
                ✕
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search results summary */}
        <AnimatePresence>
          {searchResults && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 text-center"
            >
              <p className="text-gray-600 bg-green-50 rounded-full px-6 py-2 inline-block">
                <span className="font-semibold">{searchResults.count}</span> találat a 
                <span className="font-semibold text-green-600"> "{searchResults.term}" </span> 
                keresésre
                {searchResults.count === 0 && (
                  <Button 
                    variant="link" 
                    onClick={resetSearch}
                    className="ml-2 text-green-600 p-0 h-auto font-semibold"
                  >
                    Törlés
                  </Button>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Article - csak akkor jelenjen meg, ha nincs keresés */}
        {!searchTerm && !isLoading && featuredArticle && (
          <div className="mb-12">
            <FeaturedArticle article={featuredArticle} isLoading={isLoading} />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <CategoryFilters 
              categories={categories}
              categoryConfig={CATEGORY_CONFIG}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
            
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="rounded-2xl h-80" />
                ))}
              </div>
            ) : filteredArticles.length > 0 ? (
              <ArticleGrid articles={filteredArticles} isLoading={isLoading} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-gray-50 rounded-2xl"
              >
                <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {searchTerm ? 'Nincs találat' : 'Nincsenek cikkek'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Próbálj meg másik keresőszót használni, vagy böngéssz kategóriák szerint.' 
                    : 'Jelenleg nincsenek elérhető cikkek ebben a kategóriában.'
                  }
                </p>
                <Button onClick={resetSearch} variant="outline">
                  {searchTerm ? 'Keresés törlése' : 'Összes cikk megtekintése'}
                </Button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <TrendingPosts posts={trendingArticles} isLoading={isLoading} />
              <NewsletterCta />
              
              {/* Article Statistics */}
              {!isLoading && articles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200"
                >
                  <h3 className="font-semibold text-green-800 mb-4">Magazin statisztikák</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Összes cikk:</span>
                      <span className="font-semibold text-green-800">{articles.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Kategóriák:</span>
                      <span className="font-semibold text-green-800">{categories.length - 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Szerzők:</span>
                      <span className="font-semibold text-green-800">
                        {new Set(articles.map(a => a.author)).size}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}