import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import UserLayout from '../components/user/UserLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bell, 
  Shield, 
  Eye, 
  Mail, 
  Smartphone,
  Globe,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserSettingsPage() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    profileVisible: true,
    showFavorites: true,
    showAdoptions: true,
    marketingEmails: false,
    weeklyDigest: true,
    adoptionUpdates: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        // Itt tölthetők be a tényleges beállítások az adatbázisból
      } catch (error) {
        console.error('Hiba a felhasználói adatok betöltésekor:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Itt mentenéd a beállításokat az adatbázisba
      await User.updateMyUserData({ settings });
      alert('Beállítások sikeresen mentve!');
    } catch (error) {
      console.error('Hiba a mentéskor:', error);
      alert('Hiba történt a mentéskor!');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Beállítások</h1>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? 'Mentés...' : 'Mentés'}
          </Button>
        </div>

        {/* Értesítési beállítások */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Értesítési beállítások
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email értesítések</Label>
                <p className="text-sm text-gray-600">Értesítések fogadása email-ben</p>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Örökbefogadási frissítések</Label>
                <p className="text-sm text-gray-600">Értesítés a kérelmek státuszváltozásáról</p>
              </div>
              <Switch 
                checked={settings.adoptionUpdates}
                onCheckedChange={(value) => handleSettingChange('adoptionUpdates', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Heti összefoglaló</Label>
                <p className="text-sm text-gray-600">Heti email az új állatokról és eseményekről</p>
              </div>
              <Switch 
                checked={settings.weeklyDigest}
                onCheckedChange={(value) => handleSettingChange('weeklyDigest', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing emailek</Label>
                <p className="text-sm text-gray-600">Hírlevelek és promóciós tartalmak</p>
              </div>
              <Switch 
                checked={settings.marketingEmails}
                onCheckedChange={(value) => handleSettingChange('marketingEmails', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Adatvédelmi beállítások */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              Adatvédelmi beállítások
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Profil láthatósága</Label>
                <p className="text-sm text-gray-600">Mások láthatják-e a profilodat</p>
              </div>
              <Switch 
                checked={settings.profileVisible}
                onCheckedChange={(value) => handleSettingChange('profileVisible', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Kedvencek megjelenítése</Label>
                <p className="text-sm text-gray-600">Kedvenc állatok láthatók legyenek-e a profilodon</p>
              </div>
              <Switch 
                checked={settings.showFavorites}
                onCheckedChange={(value) => handleSettingChange('showFavorites', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Örökbefogadások megjelenítése</Label>
                <p className="text-sm text-gray-600">Örökbefogadott állatok láthatók legyenek-e</p>
              </div>
              <Switch 
                checked={settings.showAdoptions}
                onCheckedChange={(value) => handleSettingChange('showAdoptions', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fiók műveletek */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Fiók műveletek
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Adatok letöltése</h4>
                  <p className="text-sm text-gray-600">Személyes adatok exportálása</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Letöltés
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-800">Fiók törlése</h4>
                  <p className="text-sm text-red-600">Fiók és összes adat végleges törlése</p>
                </div>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Törlés
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </UserLayout>
  );
}