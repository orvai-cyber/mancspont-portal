import React from 'react';
import { Star, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductHeader({ product }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-green-600 mb-1">{product.brand}</p>
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${product.rating > i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}