import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';

export default function ShelterHeader({ shelter }) {
  return (
    <div className="relative bg-gray-800 h-64 md:h-80 rounded-b-3xl overflow-hidden">
      <img
        src={shelter.photos[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800'}
        alt={`${shelter.name} háttérkép`}
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={shelter.logo_url}
            alt={`${shelter.name} logo`}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-xl flex-shrink-0 -mb-16 sm:-mb-0"
          />
          <div className="flex-grow text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-4xl md:text-5xl font-bold text-white">{shelter.name}</h1>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-lg text-orange-200">{shelter.location}</p>
          </div>
          {/* Mobile contact button only */}
          <div className="flex-shrink-0 sm:hidden">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
              <Mail className="w-5 h-5 mr-2" /> Kapcsolatfelvétel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}