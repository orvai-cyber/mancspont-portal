import React, { useState, useEffect } from 'react';
import { User, ServiceProvider } from '@/api/entities';
import AdminLayout from '@/components/admin/AdminLayout';
import ServiceProviderForm from '@/components/admin/ServiceProviderForm';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";

export default function AdminMyService() {
  const [user, setUser] = useState(null);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        if (currentUser && currentUser.service_provider_id) {
          const providerResponse = await ServiceProvider.get(currentUser.service_provider_id);
          setServiceProvider(providerResponse);
        }
      } catch (error) {
        console.error("Hiba a szolgáltató adatainak betöltésekor:", error);
        toast.error("Hiba történt a szolgáltató adatainak betöltésekor.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (providerData) => {
    setIsSubmitting(true);
    try {
      if (serviceProvider) { // Edit mode
        const updatedProvider = await ServiceProvider.update(serviceProvider.id, providerData);
        setServiceProvider(updatedProvider);
        toast.success("Szolgáltatás adatai sikeresen frissítve!");
      } else { // Create mode
        const newProvider = await ServiceProvider.create(providerData);
        // Hozzárendeljük a felhasználóhoz és elvesszük a létrehozási jogot
        await User.updateMyUserData({ 
          service_provider_id: newProvider.id,
          can_create_service_provider: false
        });
        setServiceProvider(newProvider);
        setUser(prev => ({...prev, service_provider_id: newProvider.id, can_create_service_provider: false }));
        toast.success("Szolgáltatás sikeresen létrehozva!");
      }
    } catch (error) {
      console.error("Hiba a szolgáltatás mentésekor:", error);
      toast.error(`Hiba történt a mentés során: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Skeleton className="h-[500px] w-full" />
      </AdminLayout>
    );
  }

  // Ha a felhasználó jogosult létrehozni, vagy már van neki, mutasd az űrlapot
  if (user?.can_create_service_provider || user?.service_provider_id) {
    return (
      <AdminLayout>
        <ServiceProviderForm 
          initialData={serviceProvider} 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />
      </AdminLayout>
    );
  }

  // Ha nincs joga, de valahogy ide tévedt
  return (
    <AdminLayout>
      <div className="text-center p-8">
        <h2 className="text-xl font-bold">Nincs jogosultságod.</h2>
        <p>Nincs engedélyed szolgáltatás létrehozására vagy szerkesztésére.</p>
      </div>
    </AdminLayout>
  );
}