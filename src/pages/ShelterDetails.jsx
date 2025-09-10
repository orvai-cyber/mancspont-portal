
import React, { useState, useEffect, Suspense } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shelter, Animal, Donation, Event } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';

import ShelterHeader from '../components/shelter-details/ShelterHeader';
import ShelterStats from '../components/shelter-details/ShelterStats';
import AboutSection from '../components/shelter-details/AboutSection';
import ContactInfo from '../components/shelter-details/ContactInfo';
import DonationWidget from '../components/shelter-details/DonationWidget';
import SocialLinks from '../components/shelter-details/SocialLinks';

// === LAZY LOADED COMPONENTS ===
const AnimalGrid = React.lazy(() => import('../components/shelter-details/AnimalGrid'));
const EventList = React.lazy(() => import('../components/shelter-details/EventList'));
const SupportersWall = React.lazy(() => import('../components/shelter-details/SupportersWall'));
const GallerySection = React.lazy(() => import('../components/shelter-details/GallerySection'));

export default function ShelterDetailsPage() {
  const [shelter, setShelter] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchShelterData = async () => {
      setIsLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const shelterId = searchParams.get('id');

      if (!shelterId) {
        setIsLoading(false);
        return;
      }

      try {
        const fetchedShelter = await Shelter.get(shelterId);
        if (!fetchedShelter) {
          setIsLoading(false);
          return;
        }
        setShelter(fetchedShelter);

        // Fetch related data using the shelter's name
        const [animalsData, eventsData, donationsData] = await Promise.all([
          Animal.filter({ shelter_name: fetchedShelter.name }, '-created_date', 6),
          Event.filter({ organizer: fetchedShelter.name }, '-date', 3),
          Donation.filter({ shelter_name: fetchedShelter.name }, '-created_date', 5)
        ]);

        // Filter out invalid animals before setting state
        const validAnimals = (animalsData || []).filter(animal => 
          animal && 
          typeof animal === 'object' &&
          animal.id && 
          animal.name && 
          typeof animal.name === 'string' &&
          animal.name.trim() !== '' &&
          animal.name !== 'undefined' &&
          animal.name !== 'null'
        );

        setAnimals(validAnimals);
        setEvents(eventsData || []);
        setDonations(donationsData || []);

      } catch (error) {
        console.error("Error fetching shelter details:", error);
        // Set empty arrays on error to prevent undefined access
        setAnimals([]);
        setEvents([]);
        setDonations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShelterData();
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-48 w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="hidden lg:block space-y-8">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!shelter) {
    return (
      <div className="text-center py-20">
        <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">A menhely nem található</h3>
        <p className="text-gray-600 mb-6">Lehet, hogy a keresett profil már nem létezik.</p>
        <Link to={createPageUrl('Shelters')}>
          <Button variant="outline">Vissza a menhelyekhez</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50">
      <ShelterHeader shelter={shelter} />
      <ShelterStats shelter={shelter} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <AboutSection description={shelter.description} />
            
            {/* Mobile Contact and Social Info */}
            <div className="block lg:hidden space-y-8">
              <ContactInfo shelter={shelter} />
              <SocialLinks shelter={shelter} />
            </div>

            {/* Mobile Donation Widget - after About */}
            <div className="block lg:hidden">
              <DonationWidget shelter={shelter} />
            </div>
            
            <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
              <AnimalGrid shelterName={shelter.name} />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-80 w-full rounded-2xl" />}>
              <GallerySection shelter={shelter} />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
              <EventList events={events} />
            </Suspense>

            {/* Supporters Wall on Mobile */}
            <div className="block lg:hidden">
              <Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
                <SupportersWall donations={donations} />
              </Suspense>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block space-y-8">
            <div className="sticky top-24 space-y-8">
              <DonationWidget shelter={shelter} />
              <ContactInfo shelter={shelter} />
              <SocialLinks shelter={shelter} />
              <Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
                <SupportersWall donations={donations} />
              </Suspense>
            </div>
          </aside>
        </div>
        
        {/* Mobile Contact and Social - This section is now empty as it's moved up */}
      </div>
    </div>
  );
}
