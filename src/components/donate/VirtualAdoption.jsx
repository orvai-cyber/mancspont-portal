import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PawPrint, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const virtualPets = [
  { name: 'Bolyhos', image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=880&auto=format&fit=crop', story: 'Egy idős, de rendkívül kedves cica, aki speciális étrendre szorul.' },
  { name: 'Pajti', image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?q=80&w=987&auto=format&fit=crop', story: 'Egy félénk kutyus, akinek bizalomépítő tréningre van szüksége.' },
  { name: 'Hópihe', image: 'https://images.unsplash.com/photo-1589958111032-fe7163e48b8a?q=80&w=987&auto=format&fit=crop', story: 'Egy vak nyuszi, aki különleges, biztonságos környezetet igényel.' },
];

export default function VirtualAdoption() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-purple-100 rounded-2xl mb-4">
            <PawPrint className="w-10 h-10 text-purple-700" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Virtuális Örökbefogadás</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">Nem tudsz örökbe fogadni, de szeretnél egy konkrét állaton segíteni? Legyél a virtuális gazdija, és támogasd a havi ellátását!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {virtualPets.map((pet, index) => (
            <motion.div
              key={pet.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="relative aspect-video">
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{pet.name}</h3>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-6 h-16">{pet.story}</p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Heart className="w-4 h-4 mr-2" />
                    Virtuális gazdi leszek
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}