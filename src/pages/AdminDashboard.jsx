
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/api/entities';
import { Animal, AdoptionRequest, Event, Donation } from '@/api/entities';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PawPrint,
  Users,
  Calendar,
  Heart,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdminDashboard() {
  console.log('AdminDashboard komponens betöltődött');

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalAnimals: 0,
    pendingRequests: 0,
    upcomingEvents: 0,
    totalDonations: 0,
    monthlyDonations: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [urgentAnimals, setUrgentAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // isSettingUpAdmin state removed as per optimization plan

  const loadDashboardData = useCallback(async () => {
    console.log('loadDashboardData függvény elindult');
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Early exit if user is not found or has no shelter assigned
      if (!currentUser || !currentUser.shelter_name) {
        setIsLoading(false);
        return;
      }

      const userShelterName = currentUser.shelter_name;
      console.log('Jelenlegi felhasználó menhelye:', userShelterName);

      // Use backend filtering to fetch only relevant data for the current shelter
      const [
        animals,
        requests,
        events,
        donations
      ] = await Promise.all([
        Animal.filter({ shelter_name: userShelterName }).catch(() => []),
        AdoptionRequest.filter({ shelter_name: userShelterName }).catch(() => []),
        Event.filter({ organizer_name: userShelterName }).catch(() => []),
        Donation.filter({ shelter_name: userShelterName }).catch(() => [])
      ]);

      console.log('Szűrt állatok (backendről):', animals);
      console.log('Szűrt kérelmek (backendről):', requests);

      const pendingRequests = requests.filter(r => r.status === 'beérkezett');
      console.log('Függő kérelmek:', pendingRequests);
      const urgentAnimalsList = animals.filter(a => a.is_urgent);

      // Calculate monthly donations (client-side as this is date logic)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyDonations = donations.filter(d => {
        const donationDate = new Date(d.created_date);
        return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
      });

      setStats({
        totalAnimals: animals.length,
        pendingRequests: pendingRequests.length,
        upcomingEvents: events.filter(e => new Date(e.date) >= new Date()).length,
        totalDonations: donations.reduce((sum, d) => sum + d.amount, 0),
        monthlyDonations: monthlyDonations.reduce((sum, d) => sum + d.amount, 0)
      });

      // Sort recent requests by creation date before slicing
      setRecentRequests(pendingRequests.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 5));
      setUrgentAnimals(urgentAnimalsList.slice(0, 3));

    } catch (error) {
      console.error('Hiba a dashboard betöltésekor:', error);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array as user data is fetched within the callback

  useEffect(() => {
    console.log('AdminDashboard useEffect elindult');
    loadDashboardData();
  }, [loadDashboardData]); // Dependency array includes loadDashboardData

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* isSettingUpAdmin related UI removed */}
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  // If user is loaded but has no shelter_name, display access denied
  if (!user?.shelter_name) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hozzáférés megtagadva</h2>
            <p className="text-gray-600 mb-4">
              Csak shelter adminok férhetnek hozzá ehhez az oldalhoz.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Ha úgy gondolja, hogy ez egy hiba, próbálja újratölteni az oldalt.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Oldal újratöltése
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">{user.shelter_name}</p>
          </div>
          <Badge className="bg-green-100 text-green-800">
            Admin felület
          </Badge>
        </div>

        {/* Statisztikai kártyák */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Állatok összesen</CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnimals}</div>
              <p className="text-xs text-muted-foreground">
                Örökbefogadásra váró állatok
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Függő kérelmek</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">
                Feldolgozásra vár
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Közelgő események</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Következő hónapban
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Havi adományok</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.monthlyDonations.toLocaleString()} Ft
              </div>
              <p className="text-xs text-muted-foreground">
                Ez a hónapban
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gyors műveletek */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Függő kérelmek */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Legutóbbi kérelmek
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentRequests.length > 0 ? (
                <div className="space-y-4">
                  {recentRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{request.user_name}</p>
                        <p className="text-sm text-gray-600">{request.animal_name}</p>
                      </div>
                      <Badge variant="outline" className="text-orange-600">
                        Új
                      </Badge>
                    </div>
                  ))}
                  <Link to={createPageUrl('AdminAdoptionRequests')}>
                    <Button className="w-full mt-4" variant="outline">
                      Összes megtekintése
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                  <p>Nincsenek új kérelmek</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sürgős állatok */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Sürgős esetek
              </CardTitle>
            </CardHeader>
            <CardContent>
              {urgentAnimals.length > 0 ? (
                <div className="space-y-4">
                  {urgentAnimals.map(animal => (
                    <div key={animal.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">{animal.name}</p>
                        <p className="text-sm text-gray-600">{animal.species} • {animal.age}</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">
                        Sürgős
                      </Badge>
                    </div>
                  ))}
                  <Link to={createPageUrl('AdminManageAnimals')}>
                    <Button className="w-full mt-4" variant="outline">
                      Állatok kezelése
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                  <p>Nincsenek sürgős esetek</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
