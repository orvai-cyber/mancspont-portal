
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
// Import entities for badge logic
import { AdoptionRequest } from '@/api/entities';
import { Animal } from '@/api/entities';
import { Event } from '@/api/entities';
import { Conversation } from '@/api/entities';
import { Donation } from '@/api/entities';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  X,
  LayoutDashboard,
  PawPrint,
  Heart,
  Calendar,
  Gift,
  MessageSquare,
  Wrench,
  Settings,
  Home,
  Users,
  Download,
  Building2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const sidebarNavItems = [
    {
        title: 'Dashboard',
        href: createPageUrl('AdminDashboard'),
        icon: LayoutDashboard,
    },
    {
        title: 'Menhely adataim',
        href: createPageUrl('AdminMyShelter'),
        icon: Building2,
    },
    {
        title: 'Állatok kezelése',
        href: createPageUrl('AdminManageAnimals'),
        icon: PawPrint,
    },
    {
        title: 'Örökbefogadások',
        href: createPageUrl('AdminAdoptionRequests'),
        icon: Heart,
        badge: 'adoptions' // Badge-et csak itt hagyjuk
    },
    {
        title: 'Események',
        href: createPageUrl('AdminManageEvents'),
        icon: Calendar,
    },
    {
        title: 'Üzenetek',
        href: createPageUrl('AdminMessages'),
        icon: MessageSquare,
    },
    {
        title: 'Adományok',
        href: createPageUrl('AdminDonations'),
        icon: Gift,
    },
    {
        title: 'Beállítások',
        href: createPageUrl('AdminSettings'),
        icon: Settings,
    },
    {
        title: 'Felhasználók',
        href: createPageUrl('AdminUserManagement'),
        icon: Users,
    },
    {
        title: 'Menhelyek (Admin)',
        href: createPageUrl('AdminManageShelters'),
        icon: Building2,
    },
    {
        title: 'Adat Export',
        href: createPageUrl('AdminDataExport'),
        icon: Download,
    },
    {
        title: 'Szolgáltatásom',
        href: createPageUrl('AdminMyService'),
        icon: Wrench,
    },
];

export default function AdminLayout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [badges, setBadges] = useState({});
  const location = useLocation();

  // Determine visible nav items based on user role
  const visibleNavItems = useMemo(() => {
    if (!user) return [];

    return sidebarNavItems.filter(item => {
      // Site Admin sees all applicable items
      if (user.role === 'admin') {
          // Explicitly show these management links for site admins
          if (item.href === createPageUrl('AdminManageShelters') || item.href === createPageUrl('AdminUserManagement')) {
              return true;
          }
          // For site admins, items that typically have a badge (currently only 'Örökbefogadások') should not appear.
          if (item.badge) return false;
          return true; // All other non-badge items appear for site admins
      }

      // Specific roles for specific items
      if (item.href === createPageUrl('AdminDashboard')) return true; // Dashboard generally visible

      // Shelter related items
      if ((item.href === createPageUrl('AdminMyShelter') ||
           item.href === createPageUrl('AdminManageAnimals') ||
           item.href === createPageUrl('AdminAdoptionRequests') ||
           item.href === createPageUrl('AdminDonations')) && (user.shelter_name || user.can_create_shelter)) {
          return true;
      }

      // Service Provider related items
      if (item.href === createPageUrl('AdminMyService') && (user.service_provider_id || user.can_create_service_provider)) {
          return true;
      }

      // Event Manager related items
      if (item.href === createPageUrl('AdminManageEvents') && (user.is_event_manager || user.shelter_name)) { // Shelter also manages events
          return true;
      }

      // Messages (for shelter and service provider)
      if (item.href === createPageUrl('AdminMessages') && (user.shelter_name || user.service_provider_id)) {
          return true;
      }

      // Generic items (like settings)
      if (item.href === createPageUrl('AdminSettings')) return true;
      
      return false; // Hide by default if no specific rule matches
    });
  }, [user]);

  const loadBadges = async (currentUser) => {
    // Site admin nem lát badge-et
    if (currentUser.role === 'admin') {
        setBadges({});
        return;
    }

    try {
      const isShelterAdmin = currentUser.shelter_name;
      
      let adoptionRequests = [];

      if (isShelterAdmin) {
        // Fetch only unseen adoption requests for the specific shelter
        adoptionRequests = await AdoptionRequest.filter({ 
          shelter_name: currentUser.shelter_name, 
          admin_has_seen: false 
        }).catch(() => []);
      }
      
      setBadges({
        adoptions: adoptionRequests.length
      });

    } catch (error) {
      console.error('Hiba a badge-ek betöltésekor:', error);
      setBadges({});
    }
  };

  useEffect(() => {
    const loadUserAndBadges = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        await loadBadges(currentUser);
      } catch (error) {
        console.error('Hiba a felhasználó betöltésekor az admin felületen:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserAndBadges();
  }, []);

  const handleLogout = async () => {
    await User.logout();
    window.location.href = createPageUrl('Home');
  };

  const isCurrentPage = (href) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile and static desktop sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-gray-900 text-white">
          <span className="text-xl font-semibold">MancsPont Admin</span>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <nav className="mt-8 flex-1 overflow-y-auto">
          <div className="px-4 space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const badgeValue = badges[item.badge];
              // Csak akkor jelenítjük meg a badge-et, ha van értéke és az nem nulla
              const displayBadge = item.badge && badgeValue > 0;

              return (
                <Link
                  key={item.title}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isCurrentPage(item.href)
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span className="flex-grow">{item.title}</span>
                  {displayBadge && (
                    <Badge className="ml-auto whitespace-nowrap text-xs h-5 px-2 bg-red-500 text-white flex items-center justify-center">
                      Új +{badgeValue}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 mt-auto">
             <div className="w-full border-t border-gray-700"></div>
          </div>
          <Link
            to={createPageUrl('Home')}
            onClick={() => setSidebarOpen(false)}
            className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-3 text-sm font-medium rounded-md mx-4 mt-2 mb-4"
          >
            <Home className="mr-3 flex-shrink-0 h-5 w-5" />
            Vissza a főoldalra
          </Link>
        </nav>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-end">
            <div className="ml-4 flex items-center md:ml-6">
              {isLoading ? <Skeleton className="h-8 w-8 rounded-full" /> : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-sm">
                          {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end" forceMount>
                    <DropdownMenuLabel>{user?.full_name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('UserProfileData')}>Profil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      Kijelentkezés
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {isLoading ? <Skeleton className="h-full w-full" /> : children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
