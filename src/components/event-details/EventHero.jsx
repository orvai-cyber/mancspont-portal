import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Calendar, MapPin, Clock, Users, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const eventTypeTranslations = {
  orokbefogado_nap: "Örökbefogadó nap",
  jotekonysagi_esemeny: "Jótékonysági esemény",
  oktato_program: "Oktató program",
  kozossegi_talalkozo: "Közösségi találkozó"
};

export default function EventHero({ event }) {
  const eventDate = new Date(event.date);
  
  // Mock coordinates for Budapest (in real app, you'd geocode the address)
  const defaultCoordinates = [47.4979, 19.0402];

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Csatlakozz hozzám ezen az eseményen: ${event.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // In a real app, you'd show a toast notification here
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {event.photo_url && (
        <div className="absolute inset-0">
          <img 
            src={event.photo_url} 
            alt={event.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/80 to-indigo-800/80"></div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link to={createPageUrl("Events")} className="inline-flex items-center text-blue-100 hover:text-white mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Vissza az eseményekhez
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            {/* Date Badge */}
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold">{format(eventDate, 'dd')}</div>
                <div className="text-sm uppercase font-semibold">{format(eventDate, 'MMM', { locale: hu })}</div>
                <div className="text-xs">{format(eventDate, 'yyyy')}</div>
              </div>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-2">
                  {eventTypeTranslations[event.event_type] || event.event_type}
                </Badge>
                <div className="text-blue-100 text-sm capitalize">{format(eventDate, 'EEEE', { locale: hu })}</div>
              </div>
            </div>

            {/* Event Details */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{event.title}</h1>
            
            <div className="space-y-3 text-blue-100 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-300" />
                <span className="text-lg">{event.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-300" />
                <span className="text-lg">{event.start_time} - {event.end_time}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-yellow-300" />
                <span className="text-lg">Szervező: {event.organizer}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold">
                <Calendar className="w-5 h-5 mr-2" />
                Részt veszek
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Share2 className="w-5 h-5 mr-2" />
                Megosztás
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Helyszín
              </h3>
              <div className="h-64 rounded-xl overflow-hidden bg-gray-200">
                <MapContainer 
                  center={defaultCoordinates} 
                  zoom={13} 
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={defaultCoordinates}>
                    <Popup>
                      {event.title}<br />
                      {event.location}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <p className="text-blue-100 text-sm mt-2">{event.location}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}