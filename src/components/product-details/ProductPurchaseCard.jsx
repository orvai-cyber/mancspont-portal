import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductPurchaseCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <Card className="rounded-2xl shadow-lg border-gray-200/80 bg-gray-50">
      <CardContent className="p-6">
        <div className="flex items-baseline gap-3 mb-4">
          <p className="text-4xl font-extrabold text-gray-900">{formatPrice(product.price)}</p>
          {product.on_sale && product.original_price && (
            <p className="text-xl text-gray-400 line-through">{formatPrice(product.original_price)}</p>
          )}
        </div>
        
        {product.on_sale && (
          <Badge variant="destructive" className="mb-4 text-sm px-3 py-1">Akciós ajánlat!</Badge>
        )}

        <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer" className="block">
          <Button size="lg" className="w-full text-lg py-6 bg-green-600 hover:bg-green-700">
            Megveszem
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </a>
        <p className="text-xs text-gray-500 mt-2 text-center">Partnerünk oldalán folytathatod a vásárlást.</p>

        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span>Minden vásárlással a menhelyeket támogatod.</span>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-green-600" />
            <span>Gyors és megbízható szállítás partnerünktől.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}