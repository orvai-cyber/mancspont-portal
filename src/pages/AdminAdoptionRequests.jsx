import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AdoptionRequest, User, Animal } from '@/api/entities';
import AdminLayout from '../components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  PawPrint,
  Calendar,
  Phone,
  User as UserIcon,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import AdoptionRequestDetailsDialog from '../components/admin/AdoptionRequestDetailsDialog';


// Helper function to get available statuses
const getAvailableStatuses = (currentStatus) => {
  const statusMap = {
    'beérkezett': [
      { value: 'feldolgozás alatt', label: 'Feldolgozás alatt' },
      { value: 'elfogadva', label: 'Elfogadva' },
      { value: 'elutasítva', label: 'Elutasítva' },
      { value: 'archivált', label: 'Archivált' }
    ],
    'feldolgozás alatt': [
      { value: 'elfogadva', label: 'Elfogadva' },
      { value: 'elutasítva', label: 'Elutasítva' },
      { value: 'archivált', label: 'Archivált' }
    ],
    'elfogadva': [
      { value: 'örökbeadott', label: 'Örökbeadott' },
      { value: 'archivált', label: 'Archivált' }
    ],
    'örökbeadott': [
      { value: 'archivált', label: 'Archivált' }
    ],
    'elutasítva': [
      { value: 'archivált', label: 'Archivált' }
    ],
    'archivált': []
  };
  return statusMap[currentStatus] || [];
};

function RequestListItem({ request, onStatusChange, onViewDetails, getStatusColor }) {
  const availableStatuses = getAvailableStatuses(request.status);

  return (
    <Card className={`p-4 hover:bg-gray-50 transition-colors ${!request.admin_has_seen ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-grow space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-gray-900">{request.user_name}</h3>
            <Badge className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
            {!request.admin_has_seen && <Badge className="bg-blue-500 text-white">Új</Badge>}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-1.5" title="Állat neve">
              <PawPrint className="w-4 h-4 text-gray-400" />
              <span>{request.animal_name}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Kérelem dátuma">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{format(new Date(request.created_date), 'yyyy. MM. dd.', { locale: hu })}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Telefonszám">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{request.user_phone}</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {availableStatuses.length > 0 && (
            <Select
              value=""
              onValueChange={(newStatus) => onStatusChange(request, newStatus)}
            >
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Státusz módosítása" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => onViewDetails(request)}
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Részletek
          </Button>
        </div>
      </div>
    </Card>
  );
}

function RequestList({ requests, onStatusChange, onViewDetails, getStatusColor }) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Nincsenek kérelmek ebben a kategóriában.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <RequestListItem 
          key={request.id} 
          request={request} 
          onStatusChange={onStatusChange} 
          onViewDetails={onViewDetails}
          getStatusColor={getStatusColor}
        />
      ))}
    </div>
  );
}


export default function AdminAdoptionRequests() {
  const [allRequests, setAllRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('beérkezett');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const tabs = [
    { value: 'beérkezett', label: 'Beérkezett' },
    { value: 'feldolgozás alatt', label: 'Feldolgozás alatt' },
    { value: 'elfogadva', label: 'Elfogadva' },
    { value: 'örökbeadott', label: 'Örökbeadott' },
    { value: 'elutasítva', label: 'Elutasítva' },
    { value: 'archivált', label: 'Archivált' }
  ];

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      let requestsData = [];
      if (user.role === 'admin') {
        requestsData = await AdoptionRequest.list('-created_date');
      } else if (user.shelter_name) {
        requestsData = await AdoptionRequest.filter({ shelter_name: user.shelter_name }, '-created_date');
      }
      setAllRequests(requestsData);
    } catch (error) {
      console.error("Hiba a kérelmek betöltésekor:", error);
      toast.error("Hiba történt a kérelmek betöltésekor.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleStatusChange = useCallback(async (request, newStatus) => {
    try {
      // Optimistic UI updates
      let updatedRequests = allRequests;

      if (newStatus === 'elfogadva') {
        updatedRequests = allRequests.map(r => {
          if (r.id === request.id) return { ...r, status: 'elfogadva', user_has_seen_update: false, admin_has_seen: true };
          if (r.animal_id === request.animal_id) return { ...r, status: 'archivált', user_has_seen_update: false };
          return r;
        });
        setAllRequests(updatedRequests);

        await AdoptionRequest.update(request.id, { status: 'elfogadva', user_has_seen_update: false, admin_has_seen: true });
        await Animal.update(request.animal_id, { is_active: false });
        const relatedRequests = allRequests.filter(r => r.animal_id === request.animal_id && r.id !== request.id);
        await Promise.all(relatedRequests.map(r => AdoptionRequest.update(r.id, { status: 'archivált', user_has_seen_update: false })));
        
        toast.success('Kérelem jóváhagyva és a kapcsolódó kérelmek archiválva!');
      } else if (newStatus === 'örökbeadott') {
        updatedRequests = allRequests.map(r => r.id === request.id ? { ...r, status: 'örökbeadott', user_has_seen_update: false, admin_has_seen: true } : r);
        setAllRequests(updatedRequests);

        await AdoptionRequest.update(request.id, { status: 'örökbeadott', user_has_seen_update: false, admin_has_seen: true });
        toast.success('Örökbefogadás sikeresen lezárva!');
      } else {
        updatedRequests = allRequests.map(r => r.id === request.id ? { ...r, status: newStatus, user_has_seen_update: false, admin_has_seen: true } : r);
        setAllRequests(updatedRequests);

        await AdoptionRequest.update(request.id, { status: newStatus, user_has_seen_update: false, admin_has_seen: true });
        toast.success('Kérelem státusza frissítve!');
      }
    } catch (error) {
      console.error("Hiba a státusz módosításakor:", error);
      toast.error("Hiba történt a státusz módosításakor. Visszaállítás...");
      loadInitialData(); 
    }
  }, [allRequests, loadInitialData]);

  const handleViewDetails = useCallback(async (request) => {
    setSelectedRequest(request);
    if (!request.admin_has_seen) {
      try {
        await AdoptionRequest.update(request.id, { admin_has_seen: true });
        setAllRequests(prev => prev.map(r => r.id === request.id ? { ...r, admin_has_seen: true } : r));
      } catch (error) {
        console.error("Hiba a 'látott' státusz frissítésekor:", error);
      }
    }
  }, []);
  
  const getStatusColor = (status) => ({
    'beérkezett': 'bg-blue-100 text-blue-800',
    'feldolgozás alatt': 'bg-orange-100 text-orange-800',
    'elfogadva': 'bg-green-100 text-green-800',
    'örökbeadott': 'bg-emerald-100 text-emerald-800',
    'elutasítva': 'bg-red-100 text-red-800',
    'archivált': 'bg-gray-100 text-gray-800'
  }[status] || 'bg-gray-100');

  const filteredRequests = useMemo(() => {
    return allRequests.filter(request => {
      const tabMatch = request.status === activeTab;
      const searchMatch = !searchTerm || 
                          request.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.animal_name.toLowerCase().includes(searchTerm.toLowerCase());
      return tabMatch && searchMatch;
    });
  }, [allRequests, activeTab, searchTerm]);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900">Örökbefogadási kérelmek</h1>
        
        <div className="mt-6">
          <Input 
            placeholder="Keresés jelentkező vagy állat neve alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {isLoading ? (
                <div className="text-center py-16">Töltés...</div>
              ) : (
                <RequestList 
                  requests={filteredRequests}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                  getStatusColor={getStatusColor}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {selectedRequest && (
        <AdoptionRequestDetailsDialog
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
        />
      )}
    </AdminLayout>
  );
}