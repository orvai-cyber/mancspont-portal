import React, { useState, useEffect } from 'react';
import { Product } from '@/api/entities';
import { Skeleton } from '@/components/ui/skeleton';

import HeroSection from '../components/shop/HeroSection';
import ShopByPet from '../components/shop/ShopByPet';
import FeaturedProducts from '../components/shop/FeaturedProducts';
import CategoryShowcase from '../components/shop/CategoryShowcase';
import SpecialOffers from '../components/shop/SpecialOffers';
import ExpertPicks from '../components/shop/ExpertPicks';
import BrandLogos from '../components/shop/BrandLogos';
import HowItWorks from '../components/shop/HowItWorks';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const allProducts = await Product.list('-created_date');
        setProducts(allProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);
  const saleProducts = products.filter(p => p.on_sale).slice(0, 4);
  const expertPicks = products.filter(p => p.expert_review).slice(0, 3);
  const brands = [...new Set(products.map(p => p.brand))];

  return (
    <div className="bg-white">
      <HeroSection />
      
      <main>
        <ShopByPet />
        
        {isLoading ? <Skeleton className="h-96 w-full" /> : 
          <FeaturedProducts products={featuredProducts} title="Kiemelt ajánlataink" subtitle="A legnépszerűbb termékek gazdijaink körében." />
        }
        
        <CategoryShowcase />

        {isLoading ? <Skeleton className="h-96 w-full" /> : 
          <SpecialOffers products={saleProducts} />
        }

        {isLoading ? <Skeleton className="h-96 w-full" /> : 
          <ExpertPicks products={expertPicks} />
        }
        
        <BrandLogos brands={brands} />
        
        <HowItWorks />
      </main>
    </div>
  );
}