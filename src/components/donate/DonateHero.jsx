import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DonateHero() {
  const scrollToDonate = () => {
    document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 text-white py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://images.unsplash.com/photo-1598875706253-3a185a028597?q=80&w=2070&auto=format&fit=crop')"}}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-red-600/50 via-transparent to-transparent"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block p-4 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Minden adomány egy új esély a boldogságra
          </h1>
          <p className="text-xl md:text-2xl text-yellow-100 max-w-3xl mx-auto leading-relaxed mb-10">
            A Te támogatásod létfontosságú a mentett állatok ellátásában és új, szerető otthonuk megtalálásában. Segíts velünk, hogy minél több történet végződjön boldogan!
          </p>
          <Button 
            size="lg" 
            className="text-lg px-10 py-7 bg-white text-orange-600 font-bold hover:bg-yellow-50 shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={scrollToDonate}
          >
            Támogatom őket most
            <ArrowDown className="w-5 h-5 ml-3 animate-bounce" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}