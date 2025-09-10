
import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@/api/entities';
import { EventRegistration, Event } from '@/api/entities';
import UserLayout from '../components/user/UserLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Clock, Search, Filter, ExternalLink, Frown } from 'lucide-react';
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { hu } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const eventTypeTranslations = {
  orokbefogado_nap: "Örökbefogadó nap",
  jotekonysagi_esemeny: "Jótékonysági esemény",
  oktato_program: "Oktató program",
  kozossegi_talalkozo: "Közösségi találkozó"
};

export default function UserEventsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [eventsData, setEventsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const loadUserEvents = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        const userRegistrations = await EventRegistration.filter({ 
          user_id: user.id, 
          status: 'active' 
        }, '-registration_date');
        
        setRegistrations(userRegistrations);

        // Optimalizálás: Betöltjük az összes szükséges eseményt egyszerre
        const eventIds = [...new Set(userRegistrations.map(reg => reg.event_id).filter(Boolean))];
        
        if (eventIds.length > 0) {
          const fetchedEvents = await Event.filter({ id: { '$in': eventIds } });
          const eventsMap = fetchedEvents.reduce((acc, event) => {
            acc[event.id] = event;
            return acc;
          }, {});
          setEventsData(eventsMap);
        } else {
          setEventsData({}); // No events to fetch, clear previous data
        }
        
      } catch (error) {
        console.error('Hiba az események betöltésekor:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const today = new Date();
    
    return registrations.filter(registration => {
      const event = eventsData[registration.event_id];
      if (!event) return false;

      // Keresési szűrő
      const searchMatch = searchTerm === '' ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Dátum szűrő
      const eventDate = parseISO(event.date);
      let dateMatch = true;
      
      switch (dateFilter) {
        case 'upcoming':
          dateMatch = isAfter(eventDate, startOfDay(today));
          break;
        case 'past':
          dateMatch = isBefore(eventDate, startOfDay(today));
          break;
        case 'this_month':
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          dateMatch = isAfter(eventDate, startOfMonth) && isBefore(eventDate, endOfMonth);
          break;
        default:
          dateMatch = true;
      }

      return searchMatch && dateMatch;
    });
  }, [registrations, eventsData, searchTerm, dateFilter]);

  const openEventDetails = (eventId) => {
    const url = `/EventDetails?id=${eventId}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Eseményeim</h1>
          <Badge variant="outline" className="text-sm">
            {filteredEvents.length} esemény
          </Badge>
        </div>

        {/* Keresés és Szűrés */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Keresés események között..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Szűrés dátum szerint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Minden esemény</SelectItem>
                  <SelectItem value="upcoming">Közelgő események</SelectItem>
                  <SelectItem value="past">Elmúlt események</SelectItem>
                  <SelectItem value="this_month">Ez a hónap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Események listája */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((registration) => {
                const event = eventsData[registration.event_id];
                if (!event) return null;

                const eventDate = parseISO(event.date);
                const isPast = isBefore(eventDate, new Date());

                return (
                  <motion.div
                    key={registration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${isPast ? 'opacity-75' : ''}`}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Dátum szekció */}
                          <div className="md:w-32 flex-shrink-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 p-6 border-b md:border-b-0 md:border-r border-blue-200">
                            <div className="text-3xl font-bold">{format(eventDate, 'dd')}</div>
                            <div className="text-lg font-semibold capitalize">{format(eventDate, 'MMM', { locale: hu })}</div>
                            <div className="text-sm">{format(eventDate, 'yyyy')}</div>
                          </div>
                          
                          {/* Esemény információk */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    {eventTypeTranslations[event.event_type] || event.event_type}
                                  </Badge>
                                  {isPast && (
                                    <Badge variant="outline" className="text-gray-500">
                                      Lezajlott
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                                  {event.title}
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    <span>{event.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-green-500" />
                                    <span>{event.start_time} - {event.end_time}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm">
                                      Jelentkezés: {format(parseISO(registration.registration_date), 'yyyy. MM. dd.', { locale: hu })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEventDetails(event.id)}
                                className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Részletek
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Nincsenek események</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || dateFilter !== 'all' 
                    ? 'Nincs találat a szűrési feltételek alapján.'
                    : 'Még nem jelentkeztél egyetlen eseményre sem.'}
                </p>
                {(searchTerm || dateFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={() => { setSearchTerm(''); setDateFilter('all'); }}
                  >
                    Szűrők törlése
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </UserLayout>
  );
}
