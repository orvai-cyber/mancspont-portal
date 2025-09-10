import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, Tag } from 'lucide-react';

const categoryLabels = {
    eleseg: "Eleség", felszereles: "Felszerelés", jatek: "Játék",
    apolas: "Ápolás", jutalomfalat: "Jutalomfalat", egyeb: "Egyéb"
};
const speciesLabels = { kutya: "Kutya", macska: "Macska", kisallat: "Kisállat", univerzalis: "Minden fajtának" };

export default function ProductSpecs({ product }) {
  return (
    <Card className="rounded-2xl border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Termékadatok</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2"><Tag className="w-4 h-4" /> Márka</span>
            <span className="font-medium text-gray-800">{product.brand}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2"><PawPrint className="w-4 h-4" /> Célfaj</span>
            <span className="font-medium text-gray-800">{speciesLabels[product.species]}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2"><Tag className="w-4 h-4" /> Kategória</span>
            <span className="font-medium text-gray-800">{categoryLabels[product.category]}</span>
        </div>
      </CardContent>
    </Card>
  );
}