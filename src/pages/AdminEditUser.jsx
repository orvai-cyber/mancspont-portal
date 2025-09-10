
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Save, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminEditUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('id');

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate(createPageUrl('AdminUserManagement'));
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [userData, adminUser] = await Promise.all([
          User.get(userId),
          User.me()
        ]);
        
        setUser(userData);
        setCurrentUser(adminUser);

        if (adminUser.role !== 'admin') {
          toast.error("Nincs jogosultságod ehhez a művelethez.");
          navigate(createPageUrl('AdminDashboard'));
        }

      } catch (error) {
        console.error("Hiba a felhasználó betöltésekor:", error);
        toast.error("Hiba a felhasználó adatainak betöltésekor.");
        navigate(createPageUrl('AdminUserManagement'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { id, created_date, updated_date, role, ...updateData } = user;
      await User.update(userId, updateData);
      toast.success("Felhasználó adatai sikeresen mentve.");
      navigate(createPageUrl('AdminUserManagement'));
    } catch (error) {
      console.error("Hiba mentéskor:", error);
      toast.error("Hiba történt a mentés során.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Biztosan törölni szeretnéd ${user.full_name} felhasználót? Ez a művelet nem vonható vissza.`)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await User.delete(userId);
      toast.success("Felhasználó sikeresen törölve.");
      navigate(createPageUrl('AdminUserManagement'));
    } catch (error) {
      console.error("Hiba törléskor:", error);
      toast.error("Hiba történt a törlés során.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <AdminLayout>
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter><Skeleton className="h-10 w-32" /></CardFooter>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate(createPageUrl('AdminUserManagement'))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Vissza a listához
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Felhasználó szerkesztése</CardTitle>
            <CardDescription>{user.full_name} ({user.email})</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Teljes név</Label>
                <Input id="full_name" name="full_name" value={user.full_name || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email cím</Label>
                <Input id="email" name="email" value={user.email || ''} onChange={handleInputChange} disabled />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Felhasználónév</Label>
                <Input id="username" name="username" value={user.username || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefonszám</Label>
                <Input id="phone" name="phone" value={user.phone || ''} onChange={handleInputChange} />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="bio">Bemutatkozás</Label>
                <Textarea id="bio" name="bio" value={user.bio || ''} onChange={handleInputChange} />
              </div>
          </CardContent>
          <CardFooter className="flex justify-end">
             <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Mentés...' : 'Mentés'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-red-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5"/>
                    Veszélyzóna
                </CardTitle>
                <CardDescription>
                    Ezek a műveletek véglegesek és nem vonhatók vissza.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? 'Törlés...' : 'Felhasználó törlése'}
                </Button>
            </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
}
