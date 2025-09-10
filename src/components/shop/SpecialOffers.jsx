import React from 'react';
import ProductCard from './ProductCard';
import { Gift, ArrowRight } from 'lucide-react';

export default function SpecialOffers({ products }) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-8 h-8" />
              <h2 className="text-3xl md:text-4xl font-bold">Különleges ajánlatok</h2>
            </div>
            <p className="text-lg text-orange-100">Ne maradj le a legjobb akciókról!</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-white font-semibold">
            Összes akció <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}