
import React from 'react';
import { Utensils, HeartPulse, Home, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const impacts = [
  { icon: Utensils, title: "Élelem és víz", description: "Biztosítjuk a napi táplálékot és friss vizet minden védencünknek." },
  { icon: HeartPulse, title: "Orvosi ellátás", description: "Fedezzük az oltásokat, gyógyszereket, műtéteket és a rehabilitációt." },
  { icon: Home, title: "Biztonságos menedék", description: "Fenntartjuk és fejlesztjük a menhelyeket, hogy biztonságosak legyenek." },
  { icon: Heart, title: "Új esély", description: "Támogatjuk az örökbefogadási programokat, hogy mindenki gazdira találjon." },
];

export default function ImpactSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Hová kerül az adományod?</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Minden forint közvetlenül az állatok megmentését és jólétét szolgálja.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {impacts.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mx-auto w-20 h-20 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <item.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
