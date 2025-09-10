
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Event } from '@/api/entities';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { hu } from 'date-fns/locale';
import { isSameDay, isSameWeek, startOfWeek, addDays, isAfter } from 'date-fns';

const ITEMS_PER_PAGE = 12; // Növelve a jobb UX érdekében

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateRange: 'all', // Alapértelmezett: minden esemény
    eventType: 'all',
    county: 'all',
    location: ''
  });

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Sorrend módosítása: legújabb elöl
      const allEventsData = await Event.list('-date');
      setAllEvents(allEventsData);
    } catch (error) {
      console.error("Error loading events:", error);
      setError("Hiba történt az események betöltésekor. Kérjük próbáld újra.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Optimalizált szűrés
  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allEvents.filter(event => {
      const dateParts = event.date.split('-');
      const eventDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

      const searchMatch = !filters.searchTerm ||
                          event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          event.organizer.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const eventTypeMatch = filters.eventType === 'all' || event.event_type === filters.eventType;
      const countyMatch = filters.county === 'all' || event.county === filters.county;
      const locationMatch = !filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase());

      const dateMatch = () => {
        const isUpcoming = isAfter(eventDate, today) || isSameDay(eventDate, today);
        switch (filters.dateRange) {
          case 'today':
            return isSameDay(eventDate, today);
          case 'this_week':
            return isSameWeek(eventDate, today, { locale: hu }) && isUpcoming;
          case 'this_weekend':
            const start = startOfWeek(today, { locale: hu });
            const saturday = addDays(start, 5);
            const sunday = addDays(start, 6);
            return (isSameDay(eventDate, saturday) || isSameDay(eventDate, sunday)) && isUpcoming;
          case 'upcoming':
            return isUpcoming;
          case 'all':
          default:
            return true;
        }
      };

      return searchMatch && eventTypeMatch && countyMatch && locationMatch && dateMatch();
    });
  }, [allEvents, filters]);

  // Optimalizált pagination
  useEffect(() => {
    const itemsToShow = filteredEvents.slice(0, currentPage * ITEMS_PER_PAGE);
    setDisplayedEvents(itemsToShow);
    setHasMore(itemsToShow.length < filteredEvents.length);
  }, [filteredEvents, currentPage]);

  // Szűrőváltozásnál pagination reset
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    // Animáció időzítése
    await new Promise(resolve => setTimeout(resolve, 300));
    setCurrentPage(prev => prev + 1);
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore]);

  // Infinite scroll optimalizálva
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || !hasMore) return;

      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= docHeight - 800) { // Korábbi betöltés
        loadMore();
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [loadMore, isLoadingMore, hasMore]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      dateRange: 'all',
      eventType: 'all',
      county: 'all',
      location: ''
    });
  }, []);

  // Error állapot kezelése
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Hiba történt</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadEvents} variant="outline">Újrapróbálás</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Calendar className="w-12 h-12 text-blue-100 mx-auto mb-4" />
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Események és programok
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Legyen szó családi programról, közösségi találkozóról vagy tematikus rendezvényről – itt megtalálod a hozzád illőt.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <EventFilters 
                filters={filters} 
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                resultsCount={filteredEvents.length}
              />
            </div>
          </aside>

          {/* Results */}
          <main className="lg:col-span-3">
            <div className="space-y-6">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="rounded-2xl h-48 w-full" />
                ))
              ) : displayedEvents.length > 0 ? (
                <>
                  <AnimatePresence>
                    {displayedEvents.map(event => (
                      <motion.div layout animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }} key={event.id}>
                        <EventCard event={event} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Loading More Indicator */}
                  {isLoadingMore && (
                    <div className="flex justify-center py-8">
                      <div className="flex items-center gap-3 text-blue-600">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-medium">További események betöltése...</span>
                      </div>
                    </div>
                  )}

                  {/* Load More Button */}
                  {!isLoadingMore && hasMore && (
                    <div className="flex justify-center py-8">
                      <Button 
                        onClick={loadMore}
                        variant="outline" 
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        További események betöltése
                      </Button>
                    </div>
                  )}

                  {/* End indicator */}
                  {!hasMore && displayedEvents.length > ITEMS_PER_PAGE && (
                    <div className="text-center py-8">
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 inline-block">
                        🎉 Minden eseményt megtekintettél! ({filteredEvents.length} összesen)
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                  <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Nincs találat</h3>
                  <p className="text-gray-600 mb-6">Sajnos nem találtunk a szűrési feltételeknek megfelelő eseményt.</p>
                  <Button onClick={resetFilters} variant="outline">Szűrők törlése</Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Throttle utility függvény a performance optimalizáláshoz
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
