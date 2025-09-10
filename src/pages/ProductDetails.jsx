
import React, { useState, useEffect, Suspense } from 'react';
import { Product } from '@/api/entities';
import { useLocation, Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

import ProductImageGallery from '../components/product-details/ProductImageGallery';
import ProductHeader from '../components/product-details/ProductHeader';
import ProductPurchaseCard from '../components/product-details/ProductPurchaseCard';
import ProductDescription from '../components/product-details/ProductDescription';
import ProductSpecs from '../components/product-details/ProductSpecs';

// === LAZY LOADED COMPONENTS ===
const SimilarProducts = React.lazy(() => import('../components/product-details/SimilarProducts'));


export default function ProductDetailsPage() {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const productId = searchParams.get('id');

      if (!productId) {
        setIsLoading(false);
        return;
      }

      try {
        const fetchedProduct = await Product.get(productId);

        if (fetchedProduct) {
          setProduct(fetchedProduct);
          // Similar products are now fetched directly by the SimilarProducts component
          // No need to fetch them here in the parent component
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">A termék nem található</h3>
        <p className="text-gray-600 mb-6">Lehet, hogy a keresett termék már nem elérhető.</p>
        <Link to={createPageUrl("Shop")}>
          <Button variant="outline">Vissza a Shopba</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <Link to={createPageUrl("ShopList")} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-green-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza a termékekhez
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left side - Gallery */}
            <div className="lg:col-span-3">
              <ProductImageGallery photos={product.photos} productName={product.name} />
            </div>

            {/* Right side - Info & Purchase */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <ProductHeader product={product} />
                <ProductPurchaseCard product={product} />
              </div>
            </div>
          </div>
        
          <ProductDescription description={product.description} />
          
          <ProductSpecs product={product} />

          <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl mt-12" />}>
            <SimilarProducts
              currentProductId={product.id}
              category={product.category}
              species={product.species}
            />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
