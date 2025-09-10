import React, { useState, useEffect } from 'react';
import { User, Post, Animal } from '@/api/entities';
import { useLocation, Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

import ProfileHeader from '../components/user-profile/ProfileHeader';
import ProfileStats from '../components/user-profile/ProfileStats';
import AdoptedAnimals from '../components/user-profile/AdoptedAnimals';
import PostsGrid from '../components/user-profile/PostsGrid';
import ActivityFeed from '../components/user-profile/ActivityFeed';
import Achievements from '../components/user-profile/Achievements';

export default function UserProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userAnimals, setUserAnimals] = useState([]); // Mock data for now
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const userId = searchParams.get('id');

      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        // 1. Felhasználói adatok lekérése
        // Mivel a User.get(id) nem létezik, a User.list() API-t használjuk és kliens oldalon szűrünk.
        const allUsers = await User.list();
        const foundUser = allUsers.find(u => u.id === userId);

        if (foundUser) {
            setUserProfile(foundUser);
            // 2. Posztok lekérése a felhasználó neve alapján
            const posts = await Post.filter({ author_name: foundUser.full_name }, '-created_date');
            setUserPosts(posts);
        } else {
            setUserProfile(null);
        }

        // Mock adatok az örökbefogadott állatokhoz (ezt később lehet fejleszteni)
        const mockAnimals = [
          {
            id: 1,
            name: 'Luna',
            species: 'kutya',
            breed: 'Német Juhász keverék',
            adoptedDate: '2022-05-20',
            story: 'Luna egy félénk kiscica volt, mikor megtaláltam. Ma már a legbátrabb kutya a környéken!',
            photo: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=1738&auto=format&fit=crop'
          },
          {
            id: 2,
            name: 'Mici',
            species: 'macska',
            breed: 'Házimacska',
            adoptedDate: '2023-01-10',
            story: 'Mici az utcáról került hozzám. Azóta a legkényeztetettebb cica a világon.',
            photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop'
          }
        ];
        setUserAnimals(mockAnimals);

      } catch (error) {
        console.error("Hiba a profil adatainak betöltése közben:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-20">
        <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">A profil nem található</h3>
        <p className="text-gray-600 mb-6">Lehet, hogy a keresett felhasználó nem létezik.</p>
        <Link to={createPageUrl("Home")}>
          <Button>Vissza a főoldalra</Button>
        </Link>
      </div>
    );
  }
  
  // Összerakjuk a ProfileHeader-nek szükséges profil objektumot
  const headerProfile = {
      name: userProfile.full_name,
      avatar: userProfile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${userProfile.full_name}`,
      bio: 'Állatimádó gazdi, aki hisz abban, hogy minden állat megérdemli a szeretetet.',
      location: 'Budapest',
      joinDate: userProfile.created_date,
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen">
      <ProfileHeader profile={headerProfile} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AdoptedAnimals animals={userAnimals} />
            <PostsGrid posts={userPosts} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="sticky top-24 space-y-8">
              <ProfileStats profile={headerProfile} posts={userPosts} />
              <Achievements />
              <ActivityFeed />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}