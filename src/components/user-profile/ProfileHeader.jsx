import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, MessageSquare, UserPlus } from 'lucide-react';

export default function ProfileHeader({ profile }) {
  return (
    <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="text-2xl bg-purple-500">{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-grow">
            <h1 className="text-4xl font-bold mb-3">{profile.name}</h1>
            <p className="text-lg text-purple-100 mb-6 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-purple-100 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Csatlakozott: {new Date(profile.joinDate).toLocaleDateString('hu-HU')}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Üzenet küldése
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <UserPlus className="w-4 h-4 mr-2" />
                Követés
              </Button>
            </div>
          </div>
        </div>
        
        {profile.favoriteQuote && (
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-lg italic text-center">"{profile.favoriteQuote}"</p>
          </div>
        )}
      </div>
    </div>
  );
}