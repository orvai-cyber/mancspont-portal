import React from 'react';
import ProductCard from '../shop/ProductCard';

export default function SimilarProducts({ products }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Hasonló termékek</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Lehet, hogy ezek is érdekelnek.</p>
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