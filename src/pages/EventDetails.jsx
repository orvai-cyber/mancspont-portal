import React, { useState, useEffect } from 'react';
import { Event } from '@/api/entities';
import { useLocation, Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

import EventHero from '../components/event-details/EventHero';
import EventDescription from '../components/event-details/EventDescription';
import OrganizerCard from '../components/event-details/OrganizerCard';
import EventActions from '../components/event-details/EventActions';
import ParticipantsList from '../components/event-details/ParticipantsList';
import EventGallery from '../components/event-details/EventGallery';
import SimilarEvents from '../components/event-details/SimilarEvents';

export default function EventDetailsPage() {
  const [event, setEvent] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const eventId = searchParams.get('id');

      if (!eventId) {
        setIsLoading(false);
        return;
      }

      try {
        const fetchedEvent = await Event.get(eventId);
        
        if (fetchedEvent) {
          setEvent(fetchedEvent);
          
          // Load similar events (same type or organizer)
          const related = await Event.filter(
            { event_type: fetchedEvent.event_type },
            '-date',
            5
          );
          setSimilarEvents(related.filter(e => e.id !== fetchedEvent.id).slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
      setIsLoading(false);
    };

    fetchEventData();
  }, [location]);

  if (isLoading) {
    return (
      <div className="bg-white">
        <Skeleton className="h-96 w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Frown className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Esemény nem található</h1>
          <p className="text-gray-600 mb-8">Sajnos a keresett esemény nem létezik vagy törölve lett.</p>
          <Link to={createPageUrl("Events")}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza az eseményekhez
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <EventHero event={event} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <EventDescription event={event} />
            <EventGallery event={event} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <OrganizerCard event={event} />
            <EventActions event={event} />
            <ParticipantsList event={event} />
          </div>
        </div>

        {/* Similar Events */}
        <div className="mt-16">
          <SimilarEvents events={similarEvents} />
        </div>
      </div>
    </div>
  );
}