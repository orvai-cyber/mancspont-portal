
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { AdoptionRequest, Post, Donation, Conversation, EventRegistration } from '@/api/entities'; // Added EventRegistration
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Heart,
  User as UserIcon,
  PawPrint,
  FileText,
  Calendar,
  MessageSquare,
  Gift,
  Settings,
  Menu,
  ArrowLeft
} from 'lucide-react';

const sidebarNavItems = [
  {
    title: 'Adataim',
    href: createPageUrl('UserProfileData'),
    icon: UserIcon,
  },
  {
    title: 'Örökbefogadás',
    href: createPageUrl('UserAdoptions'),
    icon: PawPrint,
    badge: 'adoptions'
  },
  { // New menu item for Favorites
    title: 'Kedvenceim',
    href: createPageUrl('UserFavorites'),
    icon: Heart,
  },
  {
    title: 'Bejegyzéseim',
    href: createPageUrl('UserPosts'),
    icon: FileText,
    badge: 'posts'
  },
  {
    title: 'Eseményeim',
    href: createPageUrl('UserEvents'),
    icon: Calendar,
    badge: 'events'
  },
  {
    title: 'Üzeneteim',
    href: createPageUrl('UserMessages'),
    icon: MessageSquare,
    badge: 'messages'
  },
  {
    title: 'Adományaim',
    href: createPageUrl('UserDonations'),
    icon: Gift,
    badge: 'donations'
  },
  {
    title: 'Beállítások',
    href: createPageUrl('UserSettings'),
    icon: Settings,
  },
];

export default function UserLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState({
    adoptions: 0,
    posts: 0,
    events: 0,
    messages: 0,
    donations: 0
  });
  const location = useLocation();

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        await loadBadges(currentUser);
      } catch (error) {
        console.error('Hiba a felhasználói adatok betöltésekor:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const loadBadges = async (currentUser) => {
    try {
      const [adoptionRequests, posts, donations, conversations, eventRegistrations] = await Promise.all([
        AdoptionRequest.filter({ user_email: currentUser.email }),
        Post.filter({ author_name: currentUser.full_name }),
        Donation.filter({ donor_email: currentUser.email }),
        Conversation.filter({ user_id: currentUser.id }),
        EventRegistration.filter({ user_id: currentUser.id, status: 'active' }) // Added EventRegistration filter
      ]);

      const unreadMessages = conversations.reduce((sum, conv) => sum + (conv.user_unread_count || 0), 0);

      setBadges({
        adoptions: adoptionRequests.length,
        posts: posts.length,
        events: eventRegistrations.length, // Updated to use eventRegistrations.length
        messages: unreadMessages,
        donations: donations.length
      });
    } catch (error) {
      console.error('Hiba a badge-ek betöltésekor:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 bg-gray-900">
          <Skeleton className="h-16 bg-gray-800" />
          <div className="p-4 space-y-2">
            {Array(7).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 bg-gray-800" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-16 px-4 bg-gray-800">
          <Heart className="w-8 h-8 text-green-500 mr-3" />
          <span className="text-white text-lg font-bold">Profilom</span>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                {item.title}
                {item.badge && badges[item.badge] > 0 && (
                  <Badge className="ml-auto bg-green-500 text-white text-xs min-w-[20px] h-5">
                    {badges[item.badge]}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <Link to={createPageUrl('Home')} className="flex items-center mb-4 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm">Vissza a főoldalra</span>
          </Link>
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.full_name}`} />
              <AvatarFallback className="bg-gray-700 text-white">
                {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.full_name}</p>
              <p className="text-xs text-gray-400">Felhasználó</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">Profilom</h1>
            <div></div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
