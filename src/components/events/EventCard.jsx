
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Building, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { motion } from 'framer-motion';
import ResponsiveImage from '../shared/ResponsiveImage';

const eventTypeTranslations = {
  orokbefogado_nap: "Örökbefogadó nap",
  jotekonysagi_esemeny: "Jótékonysági esemény",
  oktato_program: "Oktató program",
  kozossegi_talalkozo: "Közösségi találkozó"
};

export default function EventCard({ event }) {
  return (
    <Link to={createPageUrl(`EventDetails?id=${event.id}`)}>
      <motion.div
        layout
        className="group h-full"
      >
        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/80 overflow-hidden transform hover:-translate-y-1 h-full cursor-pointer">
          <div className="flex flex-col md:flex-row md:items-center h-full">
            <div className={`relative overflow-hidden md:w-48 flex-shrink-0 text-center self-stretch`}>
              <ResponsiveImage
                src={event.photo_url || `https://placehold.co/400x400/e2e8f0/cccccc/png?text=`}
                alt={event.title}
                size="medium"
                aspectRatio="square"
                className="w-full h-full md:hidden"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full md:bg-gradient-to-br md:from-blue-50 md:to-blue-100 p-6 border-b md:border-b-0 md:border-r border-blue-200 text-white md:text-blue-800">
                <div className="text-5xl font-bold">{format(new Date(event.date), 'dd')}</div>
                <div className="text-xl font-semibold capitalize">{format(new Date(event.date), 'MMM', { locale: hu })}</div>
                <div className="text-sm font-medium">{format(new Date(event.date), 'yyyy')}</div>
                <div className="text-xs mt-1 capitalize">{format(new Date(event.date), 'eeee', { locale: hu })}</div>
              </div>
            </div>
            <CardContent className="p-6 flex flex-col flex-grow">
              <div className="flex-grow flex justify-between gap-4">
                <div className="flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 capitalize">
                      {eventTypeTranslations[event.event_type] || event.event_type}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-gray-500 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{event.location}</span>
                    </div>
                    {event.county && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-green-500" />
                        <span>{event.county} vármegye</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span>Szervező: {event.organizer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{event.start_time} - {event.end_time}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block flex-shrink-0">
                  <ResponsiveImage
                    src={event.photo_url || `https://placehold.co/300x300/e2e8f0/cccccc/png?text=${encodeURIComponent(event.title.charAt(0))}`}
                    alt={event.title}
                    size="medium"
                    aspectRatio="square"
                    className="w-32 h-32 lg:w-36 lg:h-36 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
