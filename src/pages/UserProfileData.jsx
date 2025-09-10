import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import UserLayout from '../components/user/UserLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, Save, Mail, Phone, MapPin, Calendar, Shield, User as UserIcon, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserProfileDataPage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    display_preference: 'full_name',
    bio: '',
    location: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setFormData({
          username: currentUser.username || '',
          display_preference: currentUser.display_preference || 'full_name',
          bio: currentUser.bio || '',
          location: currentUser.location || '',
          phone: currentUser.phone || ''
        });
      } catch (error) {
        console.error('Hiba a felhasználói adatok betöltésekor:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Kérlek, csak képfájlt válassz!');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const { file_url } = await UploadFile({ file });
      await User.updateMyUserData({ avatar_url: file_url });
      setUser(prev => ({ ...prev, avatar_url: file_url }));
    } catch (error) {
      console.error('Hiba az avatar feltöltésekor:', error);
      alert('Hiba történt a kép feltöltésekor!');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(formData);
      setUser(prev => ({ ...prev, ...formData }));
      alert('Adatok sikeresen mentve!');
    } catch (error) {
      console.error('Hiba a mentéskor:', error);
      alert('Hiba történt a mentéskor!');
    } finally {
      setIsSaving(false);
    }
  };

  const getDisplayName = () => {
    if (!user) return '';
    if (user.display_preference === 'username' && user.username) {
      return user.username;
    }
    return user.full_name;
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
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
          <h1 className="text-3xl font-bold text-gray-800">Adataim</h1>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Mentés...' : 'Mentés'}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profilkép és alapadatok */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Profil információk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.full_name}`} />
                    <AvatarFallback className="text-2xl">
                      {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploadingAvatar}
                    />
                  </label>
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold mt-4">{user?.full_name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    A közösségben így jelensz meg: <strong>{getDisplayName()}</strong>
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Teljes név</Label>
                  <Input id="name" value={user?.full_name || ''} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="email">Email cím</Label>
                  <Input id="email" value={user?.email || ''} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="username">Felhasználónév</Label>
                  <Input 
                    id="username" 
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Válassz egyedi felhasználónevet"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ez alapján találhatnak meg mások a közösségben</p>
                </div>
                <div>
                  <Label htmlFor="display_preference">Megjelenés a közösségben</Label>
                  <Select value={formData.display_preference} onValueChange={(value) => handleInputChange('display_preference', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_name">Teljes névvel ({user?.full_name})</SelectItem>
                      <SelectItem value="username">Felhasználónévvel ({formData.username || 'Még nincs beállítva'})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="role">Szerepkör</Label>
                  <Input id="role" value={user?.role === 'admin' ? 'Adminisztrátor' : 'Felhasználó'} readOnly className="bg-gray-50" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Személyes adatok */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-600" />
                Személyes adatok
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bio">Rövid bemutatkozás</Label>
                <Textarea 
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Mesélj kicsit magadról..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="location">Lakóhely</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Város, megye"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Telefonszám</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+36 30 123 4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">Regisztráció dátuma</p>
                  <p className="text-sm text-gray-600">
                    {user?.created_date ? new Date(user.created_date).toLocaleDateString('hu-HU') : 'Ismeretlen'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">Email állapot</p>
                  <p className="text-sm text-green-600">Megerősítve</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Profil teljessége</h3>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${
                        (formData.username ? 20 : 0) + 
                        (formData.bio ? 25 : 0) + 
                        (formData.location ? 15 : 0) + 
                        (formData.phone ? 15 : 0) + 
                        (user?.avatar_url ? 25 : 0)
                      }%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  {Math.round(
                    (formData.username ? 20 : 0) + 
                    (formData.bio ? 25 : 0) + 
                    (formData.location ? 15 : 0) + 
                    (formData.phone ? 15 : 0) + 
                    (user?.avatar_url ? 25 : 0)
                  )}% kész
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* További beállítások */}
        <Card>
          <CardHeader>
            <CardTitle>Adatvédelmi beállítások</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Profil láthatósága</h4>
                  <p className="text-sm text-gray-600">Mások láthatják-e a profilodat a közösségben</p>
                </div>
                <Button variant="outline" size="sm">Beállítás</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email értesítések</h4>
                  <p className="text-sm text-gray-600">Értesítések fogadása email-ben</p>
                </div>
                <Button variant="outline" size="sm">Kezelés</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Adatok letöltése</h4>
                  <p className="text-sm text-gray-600">Személyes adatok exportálása</p>
                </div>
                <Button variant="outline" size="sm">Letöltés</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </UserLayout>
  );
}