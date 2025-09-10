import React from 'react';
import { Dog, Cat, Bird } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const pets = [
  { name: 'Kutya', icon: Dog, color: 'bg-blue-100 text-blue-600', value: 'kutya' },
  { name: 'Macska', icon: Cat, color: 'bg-orange-100 text-orange-600', value: 'macska' },
  { name: 'Kisállat', icon: Bird, color: 'bg-green-100 text-green-600', value: 'kisallat' }
];

export default function ShopByPet() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pets.map((pet, index) => (
            <Link to={createPageUrl(`ShopList?species=${pet.value}`)} key={pet.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`flex items-center justify-center gap-4 p-6 rounded-2xl cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${pet.color}`}>
                  <pet.icon className="w-8 h-8" />
                  <span className="text-xl font-bold">Shop {pet.name}</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}