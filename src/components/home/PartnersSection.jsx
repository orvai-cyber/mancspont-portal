import React from "react";
import { Award } from "lucide-react";
import { motion } from "framer-motion";

const partners = [
  { name: "PetPlanet", logo: "https://via.placeholder.com/150x50/cccccc/808080?text=PetPlanet" },
  { name: "ZooPlus", logo: "https://via.placeholder.com/150x50/cccccc/808080?text=ZooPlus" },
  { name: "Royal Canin", logo: "https://via.placeholder.com/150x50/cccccc/808080?text=Royal+Canin" },
  { name: "Fressnapf", logo: "https://via.placeholder.com/150x50/cccccc/808080?text=Fressnapf" },
  { name: "Happy Dog", logo: "https://via.placeholder.com/150x50/cccccc/808080?text=Happy+Dog" },
  { name: "Állatvédők Ligája", logo: "https://via.placeholder.com/150x50/cccccc/808080?text=Állatvédők" },
];

export default function PartnersSection() {
  return (
    <>
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Award className="w-6 h-6 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-600 uppercase tracking-wide">Támogatóink</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Akik nélkül nem sikerülne
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Hálásan köszönjük partnereink és támogatóink segítségét, akik hisznek a küldetésünkben.
        </p>
      </div>
      <div className="relative">
        <div className="flex overflow-hidden space-x-16 group">
          <motion.div 
            className="flex space-x-16"
            animate={{ x: ['0%', '-100%'] }}
            transition={{ ease: 'linear', duration: 20, repeat: Infinity }}
          >
            {partners.map((p, i) => <img key={i} src={p.logo} alt={p.name} className="max-h-12"/>)}
          </motion.div>
          <motion.div 
            className="flex space-x-16"
            animate={{ x: ['0%', '-100%'] }}
            transition={{ ease: 'linear', duration: 20, repeat: Infinity }}
          >
            {partners.map((p, i) => <img key={i} src={p.logo} alt={p.name} className="max-h-12"/>)}
          </motion.div>
        </div>
      </div>
    </>
  );
}