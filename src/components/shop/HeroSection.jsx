import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1599428665564-908691552a8c?q=80&w=2070&auto=format&fit=crop')"}}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Minden, amire kedvenced vágyik
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Válogass partnereink legjobb termékei közül, és vásárlásoddal támogasd a menhelyi állatokat!
        </p>

        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:flex items-center gap-2 text-white hover:bg-white/10 hover:text-white">
              <span>Kategóriák</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Keress terméket, márkát..."
                className="w-full h-12 bg-transparent text-white border-0 pl-12 placeholder:text-gray-400 focus:ring-0 text-lg"
              />
            </div>
            <Button className="h-12 bg-green-600 hover:bg-green-700 text-white font-bold px-6">
              Keresés
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}