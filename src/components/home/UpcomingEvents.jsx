import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, MapPin, ArrowRight, Users, Clock, Building, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { motion } from "framer-motion";

const eventTypeTranslations = {
  orokbefogado_nap: "Örökbefogadó nap",
  jotekonysagi_esemeny: "Jótékonysági esemény",
  oktato_program: "Oktató program",
  kozossegi_talalkozo: "Közösségi találkozó"
};

const EventCard = ({ event }) => (
  <Link to={createPageUrl(`EventDetails?id=${event.id}`)}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/80 overflow-hidden transform hover:-translate-y-1 h-full cursor-pointer">
        <div className="flex flex-col md:flex-row md:items-center h-full">
          <div className="relative overflow-hidden md:w-48 flex-shrink-0 text-center self-stretch">
            <img 
              src={event.photo_url || `https://placehold.co/400x400/e2e8f0/cccccc/png?text=`} 
              alt=""
              className="absolute inset-0 w-full h-full object-cover md:hidden"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full w-full md:bg-gradient-to-br md:from-blue-50 md:to-blue-100 p-6 border-b md:border-b-0 md:border-r border-blue-200 text-white md:text-blue-800">
              <div className="text-4xl lg:text-5xl font-bold">{format(new Date(event.date), 'dd')}</div>
              <div className="text-lg lg:text-xl font-semibold capitalize">{format(new Date(event.date), 'MMM', { locale: hu })}</div>
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
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
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
                <img
                  src={event.photo_url || `https://placehold.co/300x300/e2e8f0/cccccc/png?text=${encodeURIComponent(event.title.charAt(0))}`}
                  alt={event.title}
                  className="w-28 h-28 lg:w-32 lg:h-32 aspect-square object-cover rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  </Link>
);

const EventCardSkeleton = () => (
  <Card className="rounded-2xl shadow-lg border-0">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-48 p-6">
        <Skeleton className="h-12 w-12 mx-auto mb-2" />
        <Skeleton className="h-4 w-16 mx-auto mb-1" />
        <Skeleton className="h-3 w-10 mx-auto" />
      </div>
      <CardContent className="p-6 flex-grow">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-6 w-full mb-3" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </div>
  </Card>
);

export default function UpcomingEvents({ events, isLoading }) {
  return (
    <div className="space-y-6">
      {isLoading 
        ? Array(3).fill(0).map((_, i) => <EventCardSkeleton key={i} />)
        : events.slice(0,3).map(event => <EventCard key={event.id} event={event} />)
      }
    </div>
  );
}