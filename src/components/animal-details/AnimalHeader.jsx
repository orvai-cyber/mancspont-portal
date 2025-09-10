import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

export default function AnimalHeader({ animal }) {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{animal.name}</h1>
        {animal.is_urgent && (
          <Badge className="bg-red-100 text-red-800 border-red-200 text-sm px-3 py-1">SOS</Badge>
        )}
      </div>
      <div className="flex items-center gap-2 text-gray-500 mb-4">
        <MapPin className="w-4 h-4 text-orange-500" />
        <span>{animal.location}</span>
      </div>
    </>
  );
}