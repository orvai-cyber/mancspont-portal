
import React, { useState, useEffect, useCallback } from 'react';
import { User, Shelter, ServiceProvider } from '@/api/entities';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  Shield, 
  Building, 
  Wrench, 
  Calendar,
  Search,
  Settings,
  PlusCircle,
  Edit, // Added Edit icon
  Filter // Added Filter icon
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom'; // Added Link for navigation
import { createPageUrl } from '@/utils'; // Added createPageUrl utility

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // New state for role filtering
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Optimized data loading: only fetch users and current user initially.
  // Shelters and service providers will be loaded on demand when opening the edit dialog.
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [currentUserData, usersData] = await Promise.all([
        User.me().catch(() => null),
        User.list().catch(() => []),
      ]);
      
      setCurrentUser(currentUserData);
      setUsers(usersData);
    } catch (error) {
      console.error('Hiba az adatok betöltésekor:', error);
      toast.error('Hiba történt az adatok betöltésekor');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]); // Dependency array for useCallback

  const handleEditUser = async (user) => { // Made async to await API calls
    // Load shelters and providers on demand if they haven't been loaded yet
    if (shelters.length === 0) {
        try {
            const sheltersData = await Shelter.list();
            setShelters(sheltersData);
        } catch (error) {
            console.error('Hiba a menhelyek betöltésekor:', error);
            toast.error('Hiba történt a menhelyek betöltésekor');
        }
    }
    if (serviceProviders.length === 0) {
        try {
            const serviceProvidersData = await ServiceProvider.list();
            setServiceProviders(serviceProvidersData);
        } catch (error) {
            console.error('Hiba a szolgáltatók betöltésekor:', error);
            toast.error('Hiba történt a szolgáltatók betöltésekor');
        }
    }

    setSelectedUser({
      ...user,
      shelter_name: user.shelter_name || '',
      service_provider_id: user.service_provider_id || '',
      is_event_manager: user.is_event_manager || false,
      allow_multiple_services: user.allow_multiple_services || false,
      can_create_shelter: user.can_create_shelter || false,
      can_create_service_provider: user.can_create_service_provider || false,
    });
    setIsDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    setIsSaving(true);
    try {
      const updateData = {
        shelter_name: selectedUser.shelter_name || null,
        service_provider_id: selectedUser.service_provider_id || null,
        is_event_manager: selectedUser.is_event_manager,
        allow_multiple_services: selectedUser.allow_multiple_services,
        can_create_shelter: selectedUser.can_create_shelter,
        can_create_service_provider: selectedUser.can_create_service_provider,
      };

      await User.update(selectedUser.id, updateData);
      
      // Frissítjük a lokális state-et
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...updateData }
          : user
      ));

      toast.success('Felhasználó jogosultságai sikeresen frissítve');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Hiba a mentés során:', error);
      toast.error('Hiba történt a mentés során');
    } finally {
      setIsSaving(false);
    }
  };

  const getRolesBadges = (user) => {
    const roles = [];
    if (user.role === 'admin') roles.push({ label: 'Site Admin', color: 'bg-red-100 text-red-800' });
    if (user.shelter_name) roles.push({ label: 'Menhely Admin', color: 'bg-green-100 text-green-800' });
    else if (user.can_create_shelter) roles.push({ label: 'Menhely Létrehozó', color: 'bg-green-100 text-green-800 border border-green-300' });
    if (user.service_provider_id) roles.push({ label: 'Szolgáltató Admin', color: 'bg-blue-100 text-blue-800' });
    else if (user.can_create_service_provider) roles.push({ label: 'Szolgáltató Létrehozó', color: 'bg-blue-100 text-blue-800 border border-blue-300' });
    if (user.is_event_manager) roles.push({ label: 'Eseménykezelő', color: 'bg-purple-100 text-purple-800' });
    if (user.allow_multiple_services) roles.push({ label: 'Több szolgáltatás', color: 'bg-yellow-100 text-yellow-800' });
    if (roles.length === 0) roles.push({ label: 'Felhasználó', color: 'bg-gray-100 text-gray-800' });
    return roles;
  };

  const filteredUsers = users.filter(user => {
    // Keresés kiterjesztése a menhely nevére is
    const searchMatch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.shelter_name?.toLowerCase().includes(searchTerm.toLowerCase()); // Added shelter_name to search

    // Jogosultság szűrés
    const roleMatch = () => {
      switch (roleFilter) {
        case 'shelter_admin':
          return !!user.shelter_name || user.can_create_shelter;
        case 'service_admin':
          return !!user.service_provider_id || user.can_create_service_provider;
        case 'event_manager':
          return user.is_event_manager;
        case 'all':
        default:
          return true;
      }
    };
    
    return searchMatch && roleMatch();
  });

  // Csak site adminok férhetnek hozzá
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hozzáférés megtagadva</h2>
            <p className="text-gray-600">
              Csak site adminok férhetnek hozzá a felhasználók kezeléséhez.
            </p>
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
            <h1 className="text-2xl font-bold text-gray-900">Felhasználók kezelése</h1>
            <p className="text-gray-600">Jogosultságok hozzárendelése és kezelése</p>
          </div>
          <Badge className="bg-red-100 text-red-800">
            Site Admin
          </Badge>
        </div>

        {/* Keresés és szűrés */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Keresés név, email vagy menhely alapján..." // Updated placeholder
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* New role filter section */}
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Label htmlFor="role-filter" className="text-sm font-medium">Szűrés jogosultságra:</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-48" id="role-filter">
                        <SelectValue placeholder="Válassz jogosultságot" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Minden jogosultság</SelectItem>
                        <SelectItem value="shelter_admin">Menhely Admin</SelectItem>
                        <SelectItem value="service_admin">Szolgáltató Admin</SelectItem>
                        <SelectItem value="event_manager">Eseménykezelő</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
        </Card>

        {/* Felhasználók listája */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Felhasználók ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2" />
                <p>Nincsenek felhasználók</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                        <span className="text-gray-500">{user.email}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getRolesBadges(user).map((role, index) => (
                          <Badge key={index} className={role.color}>
                            {role.label}
                          </Badge>
                        ))}
                      </div>
                      {user.shelter_name && (
                        <p className="text-sm text-gray-600 mt-1">
                          Menhely: {user.shelter_name}
                        </p>
                      )}
                    </div>
                    {/* Updated buttons section */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Jogosultság {/* Changed button text */}
                      </Button>
                      <Link to={createPageUrl(`AdminEditUser?id=${user.id}`)}>
                        <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Szerkesztés
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jogosultság szerkesztő dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Jogosultságok kezelése</DialogTitle>
              <DialogDescription>
                {selectedUser?.full_name} ({selectedUser?.email}) jogosultságainak beállítása
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-6 py-4">
                {/* Menhely Admin */}
                <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                  <Label className="flex items-center gap-2 font-semibold">
                    <Building className="w-5 h-5 text-green-600" />
                    Menhely Jogosultságok
                  </Label>
                  <Select
                    value={selectedUser.shelter_name || 'none'}
                    onValueChange={(value) => 
                      setSelectedUser(prev => ({ 
                        ...prev, 
                        shelter_name: value === 'none' ? '' : value 
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Válassz menhelyet..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nincs menhelyhez rendelve</SelectItem>
                      {shelters.map(shelter => (
                        <SelectItem key={shelter.id} value={shelter.name}>
                          {shelter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-3 pt-2">
                    <Checkbox
                      id="can_create_shelter"
                      checked={selectedUser.can_create_shelter}
                      onCheckedChange={(checked) =>
                        setSelectedUser(prev => ({ 
                          ...prev, 
                          can_create_shelter: checked 
                        }))
                      }
                      disabled={!!selectedUser.shelter_name}
                    />
                    <Label htmlFor="can_create_shelter" className="flex items-center gap-2 text-sm text-gray-700">
                      <PlusCircle className="w-4 h-4 text-green-600" />
                      Új menhely létrehozásának engedélyezése
                    </Label>
                  </div>
                </div>

                {/* Szolgáltató Admin */}
                <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                  <Label className="flex items-center gap-2 font-semibold">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    Szolgáltató Jogosultságok
                  </Label>
                  <Select
                    value={selectedUser.service_provider_id || 'none'}
                    onValueChange={(value) => 
                      setSelectedUser(prev => ({ 
                        ...prev, 
                        service_provider_id: value === 'none' ? '' : value 
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Válassz szolgáltatót..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nincs szolgáltatóhoz rendelve</SelectItem>
                      {serviceProviders.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-3 pt-2">
                    <Checkbox
                      id="can_create_service_provider"
                      checked={selectedUser.can_create_service_provider}
                      onCheckedChange={(checked) =>
                        setSelectedUser(prev => ({ 
                          ...prev, 
                          can_create_service_provider: checked 
                        }))
                      }
                      disabled={!!selectedUser.service_provider_id}
                    />
                    <Label htmlFor="can_create_service_provider" className="flex items-center gap-2 text-sm text-gray-700">
                      <PlusCircle className="w-4 h-4 text-blue-600" />
                      Új szolgáltatás létrehozásának engedélyezése
                    </Label>
                  </div>
                </div>

                {/* Egyéb jogosultságok */}
                <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                   <Label className="flex items-center gap-2 font-semibold">
                    <Settings className="w-5 h-5 text-purple-600" />
                    Egyéb Jogosultságok
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="event_manager"
                      checked={selectedUser.is_event_manager}
                      onCheckedChange={(checked) =>
                        setSelectedUser(prev => ({ 
                          ...prev, 
                          is_event_manager: checked 
                        }))
                      }
                    />
                    <Label htmlFor="event_manager" className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      Eseménykezelő Admin
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="allow_multiple_services"
                      checked={selectedUser.allow_multiple_services}
                      onCheckedChange={(checked) =>
                        setSelectedUser(prev => ({ 
                          ...prev, 
                          allow_multiple_services: checked 
                        }))
                      }
                    />
                    <Label htmlFor="allow_multiple_services" className="flex items-center gap-2 text-sm text-gray-700">
                      <Wrench className="w-4 h-4 text-yellow-600" />
                      Több szolgáltatás engedélyezése
                    </Label>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Mégse
              </Button>
              <Button onClick={handleSaveUser} disabled={isSaving}>
                {isSaving ? 'Mentés...' : 'Mentés'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
