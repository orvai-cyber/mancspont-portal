import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { AdoptionRequest, Animal } from '@/api/entities';
import UserLayout from '../components/user/UserLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, PawPrint, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';

const statusConfig = {
  beérkezett: { label: 'Beérkezett', color: 'bg-blue-100 text-blue-800', icon: Clock },
  feldolgozás_alatt: { label: 'Feldolgozás alatt', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  elfogadva: { label: 'Elfogadva', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  elutasítva: { label: 'Elutasítva', color: 'bg-red-100 text-red-800', icon: XCircle }
};

export default function UserAdoptionsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        const userRequests = await AdoptionRequest.filter({ user_email: currentUser.email }, '-created_date');
        
        const requestsWithAnimalData = await Promise.all(userRequests.map(async (req) => {
          try {
            const animal = await Animal.get(req.animal_id);
            return { ...req, animalPhoto: animal.photos[0] };
          } catch {
            return { ...req, animalPhoto: `https://api.dicebear.com/8.x/icons/svg?seed=${req.animal_name}` };
          }
        }));

        setRequests(requestsWithAnimalData);

        // Itt "olvassuk el" az értesítéseket
        const unseenUpdates = userRequests.filter(req => !req.user_has_seen_update);
        if (unseenUpdates.length > 0) {
          await Promise.all(unseenUpdates.map(req => 
            AdoptionRequest.update(req.id, { user_has_seen_update: true })
          ));
        }

      } catch (error) {
        console.error('Hiba a kérelmek betöltésekor:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRequests();
  }, []);

  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Örökbefogadási kérelmeim</h1>
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        ) : requests.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {requests.map(req => {
              const status = statusConfig[req.status] || statusConfig.beérkezett;
              return (
                <Card key={req.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <Avatar className="w-16 h-16 rounded-lg">
                      <AvatarImage src={req.animalPhoto} alt={req.animal_name} className="object-cover" />
                      <AvatarFallback><PawPrint /></AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <CardTitle>{req.animal_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{req.shelter_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Beküldve: {format(new Date(req.created_date), 'yyyy. MMMM dd.', { locale: hu })}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Badge className={`${status.color} hover:${status.color}`}>
                      <status.icon className="w-4 h-4 mr-2" />
                      {status.label}
                    </Badge>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={createPageUrl(`AnimalDetails?id=${req.animal_id}`)}>
                        Állat adatlapja <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <PawPrint className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-xl font-medium text-gray-900">Még nincsenek kérelmeid</h3>
            <p className="mt-1 text-sm text-gray-500">Böngéssz az állataink között, és találj rá új társadra!</p>
            <div className="mt-6">
              <Button asChild>
                <Link to={createPageUrl('Animals')}>Állatok keresése</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}