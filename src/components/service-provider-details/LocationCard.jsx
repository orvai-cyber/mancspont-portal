import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LocationCard({ provider }) {
  const today = new Date().toLocaleString('hu-HU', { weekday: 'long' });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-slate-200/80 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-slate-800">
            <div className="p-2.5 bg-green-100 rounded-xl">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            Elérhetőség és nyitvatartás
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold text-slate-700">{provider.location}, {provider.county}</p>
            {provider.street_address && (
              <p className="text-sm text-slate-500">{provider.street_address}</p>
            )}
          </div>
          {provider.opening_hours && provider.opening_hours.length > 0 && (
            <ul className="space-y-2 pt-4 border-t border-slate-100">
              {provider.opening_hours.map(item => (
                <li key={item.day} className={`flex justify-between items-center text-sm p-2 rounded-lg transition-all duration-200 ${item.day.toLowerCase() === today.toLowerCase() ? 'font-bold text-green-800 bg-green-50' : 'text-slate-600'}`}>
                  <span>{item.day}</span>
                  {item.is_closed ? (
                      <span className="text-red-600 font-semibold">Zárva</span>
                  ) : (
                      <span className="font-semibold text-slate-800 tracking-wider">{item.open} - {item.close}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}