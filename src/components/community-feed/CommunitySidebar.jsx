import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Users, Heart, BookOpen, Calendar, Settings, LogIn, Edit, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function CommunitySidebar({ currentUser, searchQuery, onSearchChange }) {
  const menuItems = [
    { icon: Users, label: 'Közösség', href: createPageUrl('CommunityFeed'), active: true },
    { icon: Heart, label: 'Kedvenceim', href: '#', active: false, disabled: true },
    { icon: BookOpen, label: 'Saját bejegyzések', href: createPageUrl('UserPosts'), active: false },
    { icon: Calendar, label: 'Eseményeim', href: createPageUrl('UserEvents'), active: false },
  ];

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      {currentUser ? (
        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={currentUser.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.full_name}`} />
                <AvatarFallback>{currentUser.full_name?.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{currentUser.full_name}</h3>
                <p className="text-sm text-gray-500">Közösségi tag</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-lg font-bold text-purple-600">12</div>
                <div className="text-xs text-gray-500">Bejegyzés</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">5</div>
                <div className="text-xs text-gray-500">Kedvelés</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">2</div>
                <div className="text-xs text-gray-500">Követő</div>
              </div>
            </div>

            <Link to={createPageUrl('UserProfileData')} className="w-full">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="w-4 h-4 mr-2" />
                Profil szerkesztése
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-md">
          <CardContent className="p-6 text-center">
            <LogIn className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Csatlakozz hozzánk!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Jelentkezz be, hogy részt vehess a közösségben és megoszthasd történeteidet.
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Bejelentkezés
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search Bar - Desktop Only */}
      {onSearchChange && (
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="w-5 h-5 text-gray-600" />
              Keresés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Keress bejegyzések között..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Menu */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Menü</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                onClick={(e) => item.disabled && e.preventDefault()}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50 ${
                  item.active ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700'
                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}