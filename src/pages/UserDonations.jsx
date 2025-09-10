import React, { useState, useEffect } from 'react';
import { User, Donation } from '@/api/entities';
import UserLayout from '../components/user/UserLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Gift, Calendar, Building, CreditCard, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function UserDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAmount: 0,
    donationCount: 0,
    favoriteShelter: null
  });

  useEffect(() => {
    const loadDonations = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        const userDonations = await Donation.filter({ donor_email: currentUser.email }, '-created_date');
        setDonations(userDonations);
        
        // Statisztikák számítása
        const totalAmount = userDonations.reduce((sum, d) => sum + d.amount, 0);
        const shelterCounts = userDonations.reduce((acc, d) => {
          acc[d.shelter_name] = (acc[d.shelter_name] || 0) + 1;
          return acc;
        }, {});
        const favoriteShelter = Object.entries(shelterCounts).sort(([,a], [,b]) => b - a)[0]?.[0];

        setStats({
          totalAmount,
          donationCount: userDonations.length,
          favoriteShelter
        });

      } catch (error) {
        console.error('Hiba az adományok betöltésekor:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDonations();
  }, []);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'kifizetett': return 'bg-green-100 text-green-800';
      case 'beérkezett': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Adományaim</h1>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to={createPageUrl('Donate')}>
              <Gift className="w-4 h-4 mr-2" />
              Új adomány
            </Link>
          </Button>
        </div>

        {/* Statisztikák */}
        {!isLoading && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Összes adomány</p>
                    <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalAmount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Adományok száma</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.donationCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Building className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Legtöbbet támogatott</p>
                    <p className="text-sm font-bold text-gray-900">
                      {stats.favoriteShelter || 'Nincs adat'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        ) : donations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {donations.map(donation => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{donation.shelter_name}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {format(new Date(donation.created_date), 'yyyy. MMMM dd.', { locale: hu })}
                        </p>
                      </div>
                      <Badge className={getStatusColor(donation.status)}>
                        {donation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">
                          {formatAmount(donation.amount)}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <CreditCard className="w-3 h-3" />
                          {donation.payment_method || 'Bankkártya'}
                        </div>
                      </div>
                      {donation.message && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700 italic">
                            "{donation.message}"
                          </p>
                        </div>
                      )}
                      {donation.transaction_id && (
                        <p className="text-xs text-gray-500">
                          Tranzakció ID: {donation.transaction_id}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Gift className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-xl font-medium text-gray-900">Még nincsenek adományaid</h3>
            <p className="mt-1 text-sm text-gray-500">
              Támogasd kedvenc menhelyedet és segíts az állatmentésben!
            </p>
            <div className="mt-6">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link to={createPageUrl('Donate')}>
                  <Gift className="w-4 h-4 mr-2" />
                  Első adomány
                </Link>
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </UserLayout>
  );
}