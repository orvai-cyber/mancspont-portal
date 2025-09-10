import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Product } from '@/api/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

import ProductFilters from '../components/shop-list/ProductFilters';
import ProductListHeader from '../components/shop-list/ProductListHeader';
import Pagination from '../components/shared/Pagination';
import ProductCard from '../components/shop/ProductCard';

export default function ShopListPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'all';
  const initialSpecies = searchParams.get('species') || 'all';

  const [filters, setFilters] = useState({
    searchTerm: '',
    category: initialCategory,
    species: initialSpecies,
    brands: [],
    priceRange: [0, 50000],
    onlyOnSale: false,
    minRating: 0,
  });

  const [sortBy, setSortBy] = useState('popularity_score');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await Product.list('-created_date');
        setAllProducts(products);
      } catch (error) {
        console.error("Error loading products:", error);
      }
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(p => {
      const searchMatch = filters.searchTerm === '' || p.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const categoryMatch = filters.category === 'all' || p.category === filters.category;
      const speciesMatch = filters.species === 'all' || p.species === filters.species;
      const brandMatch = filters.brands.length === 0 || filters.brands.includes(p.brand);
      const priceMatch = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      const saleMatch = !filters.onlyOnSale || p.on_sale;
      const ratingMatch = p.rating >= filters.minRating;
      return searchMatch && categoryMatch && speciesMatch && brandMatch && priceMatch && saleMatch && ratingMatch;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'newest': return new Date(b.created_date) - new Date(a.created_date);
        case 'rating': return b.rating - a.rating;
        case 'popularity_score':
        default: return b.popularity_score - a.popularity_score;
      }
    });

    return filtered;
  }, [allProducts, filters, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const currentProducts = filteredAndSortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const uniqueBrands = useMemo(() => [...new Set(allProducts.map(p => p.brand))], [allProducts]);
  const maxPrice = useMemo(() => Math.max(...allProducts.map(p => p.price), 0), [allProducts]);
  
  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  return (
    <div className="bg-white">
      <ProductListHeader 
        category={filters.category} 
        species={filters.species} 
        resultsCount={filteredAndSortedProducts.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductFilters 
                filters={filters}
                onFilterChange={setFilters}
                uniqueBrands={uniqueBrands}
                maxPrice={maxPrice}
                isLoading={isLoading}
              />
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="flex items-center justify-end mb-6">
                <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setViewMode('grid')}
                      className={`rounded-lg ${viewMode === 'grid' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setViewMode('list')}
                      disabled
                      className={`rounded-lg ${viewMode === 'list' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      <List className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {Array(9).fill(0).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <motion.div layout className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence>
                    {currentProducts.map(product => (
                      <motion.div layout animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }} key={product.id}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Nincs találat</h3>
                <p className="text-gray-600 mb-6">Sajnos nem találtunk a szűrési feltételeknek megfelelő terméket.</p>
                <Button onClick={() => setFilters({
                  searchTerm: '', category: 'all', species: 'all', brands: [],
                  priceRange: [0, maxPrice], onlyOnSale: false, minRating: 0
                })} variant="outline">Szűrők törlése</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}