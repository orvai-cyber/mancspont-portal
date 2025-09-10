import React, { useState, useEffect, useMemo } from 'react';
import { Donation, User } from '@/api/entities';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Wallet, Landmark, HandCoins, Users } from 'lucide-react';
import StatCard from '../components/admin/donations/StatCard';
import DonationListItem from '../components/admin/donations/DonationListItem';
import DonationDetailsDialog from '../components/admin/donations/DonationDetailsDialog';

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('beérkezett');
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        if (currentUser.shelter_name) {
          const shelterDonations = await Donation.filter({ shelter_name: currentUser.shelter_name }, '-created_date');
          setDonations(shelterDonations);
        }
      } catch (error) {
        console.error("Hiba az adományok betöltésekor:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    const received = donations.filter(d => d.status === 'beérkezett');
    const paidOut = donations.filter(d => d.status === 'kifizetett');
    const receivedAmount = received.reduce((sum, d) => sum + d.amount, 0);
    const paidOutAmount = paidOut.reduce((sum, d) => sum + d.amount, 0);
    const uniqueDonors = new Set(donations.map(d => d.is_anonymous ? `anon_${d.id}` : d.donor_email || d.donor_name)).size;

    return {
      received: receivedAmount,
      paidOut: paidOutAmount,
      total: receivedAmount + paidOutAmount,
      count: donations.length,
      donors: uniqueDonors,
    };
  }, [donations]);

  const filteredDonations = useMemo(() => {
    return donations
      .filter(d => d.status === activeTab)
      .filter(d => 
        (d.donor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.donor_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.amount.toString().includes(searchTerm)
      );
  }, [donations, activeTab, searchTerm]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Adományok</h1>
        
        {/* Statisztikák */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Beérkezett" value={`${stats.received.toLocaleString()} Ft`} icon={Wallet} />
          <StatCard title="Kifizetett" value={`${stats.paidOut.toLocaleString()} Ft`} icon={Landmark} />
          <StatCard title="Összesen" value={`${stats.total.toLocaleString()} Ft`} icon={HandCoins} />
          <StatCard title="Adományok" value={stats.count.toString()} description="Tranzakciók száma" />
          <StatCard title="Adományozók" value={stats.donors.toString()} icon={Users} description="Egyedi támogatók" />
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Keresés adományozó vagy összeg szerint..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="beérkezett">Beérkezett adományok</TabsTrigger>
            <TabsTrigger value="kifizetett">Kifizetett adományok</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4 space-y-4">
            {isLoading ? (
              <p>Betöltés...</p>
            ) : filteredDonations.length > 0 ? (
              filteredDonations.map(donation => (
                <DonationListItem key={donation.id} donation={donation} onViewDetails={setSelectedDonation} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-500">Nincsenek a feltételeknek megfelelő adományok.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <DonationDetailsDialog 
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
        donation={selectedDonation}
      />
    </AdminLayout>
  );
}