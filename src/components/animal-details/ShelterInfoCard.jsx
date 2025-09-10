import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';

export default function ShelterInfoCard({ shelter }) {
  if (!shelter) return null;
  
  return (
    <Link to={createPageUrl(`ShelterDetails?id=${shelter.id}`)} className="block group">
      <Card className="shadow-lg border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <img 
            src={shelter.logo_url} 
            alt={shelter.name} 
            className="w-24 h-24 rounded-full object-cover flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
          />
          <div className="flex-grow text-center sm:text-left">
            <p className="text-sm text-gray-500">Gondozó menhely</p>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-green-600 transition-colors">{shelter.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{shelter.description?.substring(0,150)}...</p>
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto flex-shrink-0">
            <Button 
              variant="outline" 
              className="w-full group-hover:border-green-500 group-hover:text-green-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Profil <ArrowRight className="w-4 h-4 ml-2"/>
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 w-full transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Itt a támogatás logika jönne
              }}
            >
              <Heart className="w-4 h-4 mr-2"/> Támogatom
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}