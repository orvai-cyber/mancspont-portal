import React, { useState, useEffect, useMemo } from 'react';
import { User, ServiceProvider, Conversation } from '@/api/entities';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  MessageSquare,
  Star,
  CheckCircle,
  Edit,
  AlertCircle,
  BarChart,
  UserCheck,
  ArrowRight
} from 'lucide-react';

export default function ServiceProviderDashboard() {
  const [user, setUser] = useState(null);
  const [service, setService] = useState(null);
  const [stats, setStats] = useState({
    unreadMessages: 0,
    rating: 0,
    reviews: 0,
  });
  const [recentConversations, setRecentConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        if (!currentUser.service_provider_id) {
          setIsLoading(false);
          return;
        }

        const [serviceData, conversationsData] = await Promise.all([
          ServiceProvider.get(currentUser.service_provider_id),
          Conversation.filter({ service_provider_id: currentUser.service_provider_id }, '-last_message_timestamp', 5)
        ]);

        setService(serviceData);
        setRecentConversations(conversationsData || []);

        setStats({
          unreadMessages: (conversationsData || []).filter(c => c.recipient_unread_count > 0).length,
          rating: serviceData.rating || 0,
          reviews: serviceData.review_count || 0,
        });

      } catch (error) {
        console.error('Hiba a szolgáltatói vezérlőpult betöltésekor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const profileCompleteness = useMemo(() => {
    if (!service) return { score: 0, missing: [] };
    
    let score = 0;
    const totalPoints = 8;
    const missing = [];

    if (service.name) score++; else missing.push("Add meg a szolgáltatásod nevét");
    if (service.description) score++; else missing.push("Írj egy részletes leírást");
    if (service.main_photo_url) score++; else missing.push("Tölts fel egy profilképet");
    if (service.phone) score++; else missing.push("Add meg a telefonszámodat");
    if (service.services_offered?.length > 0) score++; else missing.push("Adj hozzá legalább egy szolgáltatást");
    if (service.pricing?.length > 0) score++; else missing.push("Töltsd ki az árlistát");
    if (service.gallery_photos?.length > 0) score++; else missing.push("Tölts fel galéria képeket");
    if (service.opening_hours?.some(d => !d.is_closed)) score++; else missing.push("Állítsd be a nyitvatartást");
    
    const percentage = Math.round((score / totalPoints) * 100);
    return { score: percentage, missing: missing.slice(0, 3) };
  }, [service]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!service) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="text-center p-8 max-w-lg">
            <CardHeader>
              <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Még nincs szolgáltatásod</CardTitle>
              <CardDescription className="text-gray-600 mb-4">
                Hozd létre a szolgáltatói profilodat, hogy megjelenj a portálon és ügyfeleket szerezz!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={createPageUrl('AdminMyService')}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Profil létrehozása
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vezérlőpult</h1>
          <p className="text-gray-600">{service.name}</p>
        </div>

        {/* Statisztikai kártyák */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Olvasatlan üzenetek</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.unreadMessages > 0 ? 'text-orange-600' : ''}`}>
                {stats.unreadMessages}
              </div>
              <p className="text-xs text-muted-foreground">Válaszra váró megkeresés</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Értékelés</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rating.toFixed(1)} / 5.0</div>
              <p className="text-xs text-muted-foreground">{stats.reviews} értékelés alapján</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profil állapot</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileCompleteness.score}%</div>
              <p className="text-xs text-muted-foreground">Profil kitöltöttsége</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ellenőrzés</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {service.verified ? (
                <div className="text-2xl font-bold text-green-600">Ellenőrzött</div>
              ) : (
                <div className="text-2xl font-bold text-gray-500">Nincs ellenőrizve</div>
              )}
              <p className="text-xs text-muted-foreground">Partneri státusz</p>
            </CardContent>
          </Card>
        </div>

        {/* Gyors műveletek */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profil teljessége */}
          <Card>
            <CardHeader>
              <CardTitle>Tedd teljessé a profilod!</CardTitle>
              <CardDescription>A jobban kitöltött profilok több ügyfelet vonzanak.</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={profileCompleteness.score} className="mb-4" />
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                {profileCompleteness.missing.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to={createPageUrl('AdminMyService')}>
                <Button variant="outline"><Edit className="w-4 h-4 mr-2" /> Profil szerkesztése</Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Legutóbbi üzenetek */}
          <Card>
            <CardHeader>
              <CardTitle>Legutóbbi üzenetek</CardTitle>
              <CardDescription>Ne hagyd várakozni az érdeklődőket!</CardDescription>
            </CardHeader>
            <CardContent>
              {recentConversations.length > 0 ? (
                <div className="space-y-3">
                  {recentConversations.map(conv => (
                    <div key={conv.id} className="flex items-center justify-between p-2 bg-gray-50/70 rounded-lg">
                      <div>
                        <p className="font-semibold">{conv.user_name}</p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">{conv.last_message_preview}</p>
                      </div>
                      {conv.recipient_unread_count > 0 && (
                        <Badge variant="destructive">{conv.recipient_unread_count}</Badge>
                      )}
                    </div>
                  ))}
                  <Link to={createPageUrl('AdminMessages')}>
                    <Button className="w-full mt-4" variant="outline">
                      Összes üzenet <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                  <p>Nincsenek új üzeneteid.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}