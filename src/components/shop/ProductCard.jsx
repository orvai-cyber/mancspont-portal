
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'; // Added Card and CardContent import
import { ArrowRight, Heart } from 'lucide-react'; // Keeping these as they might be used elsewhere or planned
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ResponsiveImage from '../shared/ResponsiveImage'; // Added ResponsiveImage import

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', minimumFractionDigits: 0 }).format(price);
  };

  const discountPercentage = product.on_sale && product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Link to={createPageUrl(`ProductDetails?id=${product.id}`)} className="h-full block"> {/* Outer Link wrapping the Card */}
      <Card className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/80 overflow-hidden transform hover:-translate-y-2 h-full flex flex-col">
        <div className="relative">
          <ResponsiveImage
            src={product.photos[0] || `https://placehold.co/400x400/e2e8f0/cccccc/png?text=${encodeURIComponent(product.name.charAt(0))}`}
            alt={product.name}
            size="medium"
            aspectRatio="square"
            className="h-64 group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-green-100 text-green-800">Támogatás</Badge>
          </div>
          {product.on_sale && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="destructive">{discountPercentage}% Akció</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6 flex-grow flex flex-col">
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          {/* Removed internal Link for product name as the entire card is now a link */}
          <h3 className="font-bold text-lg text-gray-900 flex-grow mb-4 group-hover:text-green-700 transition-colors">{product.name}</h3>
          
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-4">
              <p className="text-2xl font-extrabold text-gray-900">{formatPrice(product.price)}</p>
              {product.on_sale && product.original_price && (
                <p className="text-md text-gray-400 line-through">{formatPrice(product.original_price)}</p>
              )}
            </div>
            {/* The button is still a separate link to details, even though the card is clickable */}
            <Link to={createPageUrl(`ProductDetails?id=${product.id}`)}>
              <Button className="w-full bg-gray-800 hover:bg-gray-900">
                Részletek
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
