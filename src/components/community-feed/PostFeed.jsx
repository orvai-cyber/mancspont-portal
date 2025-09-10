import React, { useMemo, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Frown, RefreshCw, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import PostItem from './PostItem';

const POSTS_PER_LOAD = 20;

export default function PostFeed({ 
  posts, 
  isLoading, 
  isLoadingMore,
  currentUser, 
  onPostLike, 
  onPostDelete,
  onPostClick, 
  onLoadMore,
  activeFilter, 
  sortBy, 
  searchQuery,
  hasError,
  onRetry
}) {
  
  // Optimalizált szűrés és rendezés
  const processedPosts = useMemo(() => {
    let filtered = [...posts];
    
    // Szűrés típus szerint
    if (activeFilter !== 'all') {
      filtered = filtered.filter(post => post.post_type === activeFilter);
    }
    
    // Keresés alkalmazása
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.author_name.toLowerCase().includes(searchLower) ||
        (post.animal_name && post.animal_name.toLowerCase().includes(searchLower))
      );
    }
    
    // Rendezés alkalmazása
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes || 0) - (a.likes || 0);
        case 'recent':
        default:
          return new Date(b.created_date) - new Date(a.created_date);
      }
    });
    
    return filtered;
  }, [posts, activeFilter, sortBy, searchQuery]);

  // Betöltés kezelése
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [isLoadingMore, onLoadMore]);

  // Infinite scroll kezelése
  React.useEffect(() => {
    if (isLoading || isLoadingMore) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 1000 && processedPosts.length >= POSTS_PER_LOAD) {
        handleLoadMore();
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [isLoading, isLoadingMore, processedPosts.length, handleLoadMore]);

  // Error állapot
  if (hasError && !isLoading) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Hiba történt</h3>
        <p className="text-gray-600 mb-6">Nem sikerült betölteni a bejegyzéseket.</p>
        <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Újrapróbálás
        </Button>
      </div>
    );
  }

  // Loading állapot
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-grow">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <Skeleton className="h-40 w-full rounded-lg mb-4" />
            <div className="flex gap-6">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-14" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Üres állapot
  if (processedPosts.length === 0) {
    const isFiltered = activeFilter !== 'all' || searchQuery.trim() !== '';
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-white rounded-2xl border border-gray-200"
      >
        <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {isFiltered ? 'Nincs találat' : 'Még nincsenek bejegyzések'}
        </h3>
        <p className="text-gray-600 mb-6">
          {isFiltered
            ? 'Próbálj meg más szűrőket használni vagy keress másra.'
            : 'Legyél te az első, aki megoszt valamit a közösséggel!'
          }
        </p>
        {isFiltered ? (
          <Button variant="outline" onClick={() => window.location.reload()}>
            Szűrők törlése
          </Button>
        ) : (
          currentUser && (
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Első bejegyzés írása
            </Button>
          )
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search results info */}
      {searchQuery.trim() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800">
            <span className="font-semibold">{processedPosts.length}</span> találat a 
            <span className="font-semibold"> "{searchQuery}" </span>keresésre
          </p>
        </div>
      )}

      {/* Posts list */}
      <AnimatePresence>
        {processedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <PostItem
              post={post}
              currentUser={currentUser}
              onLike={() => onPostLike(post.id)}
              onDelete={() => onPostDelete(post.id)}
              onClick={() => onPostClick(post)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Load more section */}
      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 text-purple-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-sm font-medium">További bejegyzések betöltése...</span>
          </div>
        </div>
      )}

      {/* Load more button */}
      {!isLoadingMore && processedPosts.length >= POSTS_PER_LOAD && (
        <div className="flex justify-center py-8">
          <Button 
            onClick={handleLoadMore}
            variant="outline" 
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            További bejegyzések betöltése
          </Button>
        </div>
      )}

      {/* End indicator */}
      {processedPosts.length > 0 && processedPosts.length < POSTS_PER_LOAD && (
        <div className="text-center py-8">
          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 inline-block">
            🎉 Minden bejegyzést megtekintettél! ({processedPosts.length} összesen)
          </div>
        </div>
      )}
    </div>
  );
}

// Throttle utility függvény
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}