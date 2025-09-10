import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

const eventTypeTranslations = {
  orokbefogado_nap: "Örökbefogadó nap",
  jotekonysagi_esemeny: "Jótékonysági esemény", 
  oktato_program: "Oktató program",
  kozossegi_talalkozo: "Közösségi találkozó"
};

export default function SimilarEvents({ events }) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Hasonló események</h2>
        <Link to={createPageUrl("Events")}>
          <Button variant="outline">
            Összes esemény
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Link to={createPageUrl(`EventDetails?id=${event.id}`)}>
              <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden bg-white group h-full">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-1/3 flex-shrink-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 p-4 border-b md:border-b-0 md:border-r border-blue-200 text-center">
                    <div className="text-3xl font-bold">{format(new Date(event.date), 'dd')}</div>
                    <div className="text-lg font-semibold capitalize">{format(new Date(event.date), 'MMM', { locale: hu })}</div>
                    <div className="text-sm">{format(new Date(event.date), 'yyyy')}</div>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 capitalize mb-2 self-start">
                      {eventTypeTranslations[event.event_type] || event.event_type}
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 flex-grow">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{event.location}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}