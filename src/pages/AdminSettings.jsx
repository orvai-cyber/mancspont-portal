import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  Shield, 
  Eye, 
  Mail, 
  Smartphone,
  Globe,
  Download,
  Trash2,
  AlertTriangle,
  Settings as SettingsIcon,
  User as UserIcon,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newMessageNotifications: true,
    weeklyReports: false,
    marketingEmails: false,
    profileVisible: true,
    showContactInfo: true,
    allowDirectMessages: true,
    autoReplyEnabled: false,
    autoReplyMessage: ''
  });
  const [userProfile, setUserProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    avatar_url: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        // Load user profile data
        setUserProfile({
          full_name: currentUser.full_name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          bio: currentUser.bio || '',
          location: currentUser.location || '',
          avatar_url: currentUser.avatar_url || ''
        });

        // Load settings from user data
        if (currentUser.settings) {
          setSettings(prev => ({ ...prev, ...currentUser.settings }));
        }
      } catch (error) {
        console.error('Hiba a felhasználói adatok betöltésekor:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileChange = (key, value) => {
    setUserProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData({ 
        settings,
        phone: userProfile.phone,
        bio: userProfile.bio,
        location: userProfile.location,
        avatar_url: userProfile.avatar_url
      });
      toast.success('Beállítások sikeresen mentve!');
    } catch (error) {
      console.error('Hiba a mentéskor:', error);
      toast.error('Hiba történt a mentéskor!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    const exportData = {
      user_profile: userProfile,
      settings: settings,
      export_date: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `szolgaltato_adatok_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Adatok sikeresen exportálva!');
  };

  const handleDeleteAccount = () => {
    if (confirm('Biztosan törli a fiókját? Ez a művelet nem visszavonható!')) {
      toast.info('A fiók törlése funkcionalitás hamarosan elérhető lesz.');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Beállítások</h1>
            <p className="text-gray-600 mt-2">Személyes adatok és értesítési beállítások kezelése</p>
          </div>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? 'Mentés...' : 'Mentés'}
          </Button>
        </div>

        {/* Személyes adatok */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Személyes adatok
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Teljes név</Label>
                <Input 
                  value={userProfile.full_name}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Ez az érték nem módosítható</p>
              </div>
              <div>
                <Label>Email cím</Label>
                <Input 
                  value={userProfile.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Ez az érték nem módosítható</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Telefonszám</Label>
                <Input 
                  value={userProfile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="+36 30 123 4567"
                />
              </div>
              <div>
                <Label>Lakóhely</Label>
                <Input 
                  value={userProfile.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  placeholder="Budapest, Magyarország"
                />
              </div>
            </div>

            <div>
              <Label>Bemutatkozás</Label>
              <Textarea 
                value={userProfile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                placeholder="Rövid bemutatkozás..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

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
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Új üzenetek</Label>
                <p className="text-sm text-gray-600">Értesítés új üzenetekről</p>
              </div>
              <Switch 
                checked={settings.newMessageNotifications}
                onCheckedChange={(checked) => handleSettingChange('newMessageNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Heti jelentések</Label>
                <p className="text-sm text-gray-600">Heti összefoglaló a szolgáltatás teljesítményéről</p>
              </div>
              <Switch 
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing emailek</Label>
                <p className="text-sm text-gray-600">Hírlevelek és promóciós tartalom</p>
              </div>
              <Switch 
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Adatvédelmi beállítások */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Adatvédelmi beállítások
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Profil láthatósága</Label>
                <p className="text-sm text-gray-600">A szolgáltatás megjelenjen a nyilvános listában</p>
              </div>
              <Switch 
                checked={settings.profileVisible}
                onCheckedChange={(checked) => handleSettingChange('profileVisible', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Kapcsolati adatok megjelenítése</Label>
                <p className="text-sm text-gray-600">Telefonszám és email cím látható legyen</p>
              </div>
              <Switch 
                checked={settings.showContactInfo}
                onCheckedChange={(checked) => handleSettingChange('showContactInfo', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Közvetlen üzenetek engedélyezése</Label>
                <p className="text-sm text-gray-600">Felhasználók küldhetnek közvetlen üzeneteket</p>
              </div>
              <Switch 
                checked={settings.allowDirectMessages}
                onCheckedChange={(checked) => handleSettingChange('allowDirectMessages', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Automatikus válaszok */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Automatikus válaszok
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Automatikus válasz engedélyezése</Label>
                <p className="text-sm text-gray-600">Automatikus üzenet küldése új megkeresésekre</p>
              </div>
              <Switch 
                checked={settings.autoReplyEnabled}
                onCheckedChange={(checked) => handleSettingChange('autoReplyEnabled', checked)}
              />
            </div>

            {settings.autoReplyEnabled && (
              <div>
                <Label>Automatikus válasz üzenet</Label>
                <Textarea 
                  value={settings.autoReplyMessage}
                  onChange={(e) => handleSettingChange('autoReplyMessage', e.target.value)}
                  placeholder="Köszönöm a megkeresését! Hamarosan válaszolok..."
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adatkezelés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Adatkezelés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Adatok exportálása</Label>
                <p className="text-sm text-gray-600">Töltse le személyes adatait JSON formátumban</p>
              </div>
              <Button onClick={handleExportData} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportálás
              </Button>
            </div>

            <Separator />

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Fiók törlése:</strong> Ez véglegesen törli a fiókját és minden kapcsolódó adatot. 
                Ez a művelet nem visszavonható.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-red-600">Fiók törlése</Label>
                <p className="text-sm text-gray-600">Véglegesen törli a fiókját és minden adatát</p>
              </div>
              <Button onClick={handleDeleteAccount} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Fiók törlése
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  );
}