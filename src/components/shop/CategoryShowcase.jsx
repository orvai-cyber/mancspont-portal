import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const categories = [
  { name: 'Eleség', image: 'https://images.unsplash.com/photo-1598875706253-33e8517cff4a?q=80&w=1964&auto=format&fit=crop', value: 'eleseg' },
  { name: 'Játékok', image: 'https://images.unsplash.com/photo-1541348263663-895399414e13?q=80&w=1964&auto=format&fit=crop', value: 'jatek' },
  { name: 'Felszerelés', image: 'https://images.unsplash.com/photo-1583084220513-c99374465a3d?q=80&w=1974&auto-format&fit=crop', value: 'felszereles' },
  { name: 'Ápolás', image: 'https://images.unsplash.com/photo-1622397985868-6b8b0c40d1a4?q=80&w=1932&auto=format&fit=crop', value: 'apolas' }
];

export default function CategoryShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Vásárlás kategória szerint</h2>
          <p className="text-lg text-gray-600 mt-4">Találd meg gyorsan, amire szükséged van.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link to={createPageUrl(`ShopList?category=${cat.value}`)} key={cat.name}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer h-full"
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">{cat.name}</h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}