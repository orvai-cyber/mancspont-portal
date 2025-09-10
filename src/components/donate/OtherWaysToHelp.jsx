import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Box, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ways = [
  { icon: Users, title: "Légy önkéntes", description: "Időddel és energiáddal is óriási segítséget nyújthatsz a menhelyeken.", link: "#" },
  { icon: Box, title: "Tárgyi adomány", description: "Eledelre, takarókra, játékokra mindig szükség van. Nézd meg a listát!", link: "#" },
  { icon: Share2, title: "Oszd meg a hírt", description: "Kövess minket a közösségi médiában és segíts, hogy minél több emberhez eljussunk.", link: "#" },
];

export default function OtherWaysToHelp() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Nem csak pénzzel segíthetsz</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Minden segítség számít. Nézd meg, hogyan járulhatsz még hozzá a küldetésünkhöz.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ways.map((way, index) => (
             <motion.div
              key={way.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <CardContent className="p-8 text-center flex-grow flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <way.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{way.title}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{way.description}</p>
                  <Button variant="outline" className="mt-auto">
                    Tudj meg többet <ArrowRight className="w-4 h-4 ml-2" />
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