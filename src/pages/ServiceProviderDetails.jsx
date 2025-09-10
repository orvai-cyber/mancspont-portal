import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ServiceProvider } from '@/api/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';
import ChatWidget from '../components/services/ChatWidget';

import ServiceProviderHeader from '../components/service-provider-details/ServiceProviderHeader';
import ServiceProviderStats from '../components/service-provider-details/ServiceProviderStats';
import AboutSection from '../components/service-provider-details/AboutSection';
import GallerySection from '../components/service-provider-details/GallerySection';
import PricingSection from '../components/service-provider-details/PricingSection';
import ContactWidget from '../components/service-provider-details/ContactWidget';
import ContactInfo from '../components/service-provider-details/ContactInfo';
import SimilarProviders from '../components/service-provider-details/SimilarProviders';

export default function ServiceProviderDetailsPage() {
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      loadProvider(id);
    }
  }, [location.search]);

  const loadProvider = async (id) => {
    setIsLoading(true);
    try {
      const data = await ServiceProvider.get(id);
      setProvider(data);
    } catch (error) {
      console.error('Error loading service provider:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactClick = () => {
    setShowChat(true);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-64 w-full mb-8 rounded-3xl" />
          <Skeleton className="h-24 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-20 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Szolgáltató nem található</h3>
          <p className="text-gray-600">A keresett szolgáltató nem elérhető vagy nem létezik.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ServiceProviderHeader provider={provider} />
      <ServiceProviderStats provider={provider} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AboutSection provider={provider} />
            <GallerySection photos={provider.gallery_photos} />
            <PricingSection pricing={provider.pricing} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <ContactWidget onContactClick={handleContactClick} />
            <ContactInfo provider={provider} />
          </aside>
        </div>

        {/* Similar Providers Section - teljes szélesség */}
        <SimilarProviders currentProvider={provider} />
      </div>

      {/* Chat Widget */}
      {showChat && provider && (
        <ChatWidget
          serviceProvider={provider}
          onClose={() => setShowChat(false)}
          autoOpen={true}
        />
      )}
    </div>
  );
}