

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import {
  Menu, X, Heart, PawPrint, Home, Users, Calendar,
  BookOpen, ShoppingBag, DollarSign, UserCircle,
  LogOut, Settings, MessageCircle, Star, Phone,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toaster } from 'sonner';

export default function Layout({ children, currentPageName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Force scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      window.location.href = createPageUrl("Home");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    {
      name: 'Állatok',
      href: createPageUrl("Animals"),
      icon: Heart,
      current: currentPageName === 'Animals' || currentPageName === 'AnimalDetails'
    },
    {
      name: 'Menhelyek',
      href: createPageUrl("Shelters"),
      icon: Users,
      current: currentPageName === 'Shelters' || currentPageName === 'ShelterDetails'
    },
    {
      name: 'Szolgáltatások',
      href: createPageUrl("Services"),
      icon: Wrench,
      current: currentPageName === 'Services' || currentPageName === 'ServiceProviderDetails'
    },
    {
      name: 'Események',
      href: createPageUrl("Events"),
      icon: Calendar,
      current: currentPageName === 'Events' || currentPageName === 'EventDetails'
    },
    {
      name: 'Közösség',
      href: createPageUrl("Community"),
      icon: MessageCircle,
      current: currentPageName === 'Community' || currentPageName === 'CommunityFeed' || currentPageName === 'PostDetails'
    },
    {
      name: 'Blog',
      href: createPageUrl("Blog"),
      icon: BookOpen,
      current: currentPageName === 'Blog' || currentPageName === 'ArticleDetails'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors position="top-center" />
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <PawPrint className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                  MancsPont
                </h1>
                <p className="hidden sm:block text-xs text-gray-500 font-medium">Portál az állatokért</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.current
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* User Menu & Mobile Menu Button */}
            <div className="flex items-center gap-4">
              {!isLoading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-green-100 text-green-700 font-medium text-sm">
                              {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.full_name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={createPageUrl("UserProfileData")} className="cursor-pointer">
                            <UserCircle className="w-4 h-4 mr-2" />
                            Profilom
                          </Link>
                        </DropdownMenuItem>
                        {(user.role === 'admin' || user.shelter_name || user.service_provider_id || user.is_event_manager) && (
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl("AdminDashboard")} className="cursor-pointer">
                              <Settings className="w-4 h-4 mr-2" />
                              Admin Felület
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Kijelentkezés
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      onClick={() => User.login()}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Bejelentkezés
                    </Button>
                  )}
                </>
              )}

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? 'Menü bezárása' : 'Menü megnyitása'}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                >
                  {isMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${
                        item.current
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">MancsPont.hu</h3>
                  <p className="text-gray-400 text-sm">Portál az állatokért</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Segítünk összekötni az örökbefogadható állatokat szerető gazdikkal.
                Minden állat megérdemli a második esélyt egy boldog életre.
              </p>
              <h4 className="text-lg font-semibold mb-4 text-white">Céljaink számokban</h4>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">2,500+</div>
                  <div className="text-sm text-gray-400">Örökbefogadott</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">150+</div>
                  <div className="text-sm text-gray-400">Partnermenhely</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">25,000+</div>
                  <div className="text-sm text-gray-400">Regisztrált gazdi</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Navigáció</h4>
              <ul className="space-y-2">
                <li>
                  <Link to={createPageUrl("Animals")} className="text-gray-300 hover:text-white transition-colors">
                    Állatok
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Shelters")} className="text-gray-300 hover:text-white transition-colors">
                    Menhelyek
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Services")} className="text-gray-300 hover:text-white transition-colors">
                    Szolgáltatások
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Events")} className="text-gray-300 hover:text-white transition-colors">
                    Események
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Community")} className="text-gray-300 hover:text-white transition-colors">
                    Közösség
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Blog")} className="text-gray-300 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Donate")} className="text-gray-300 hover:text-white transition-colors">
                    Adományozás
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Kapcsolat</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to={createPageUrl("ServiceProviderApplication")} 
                    className="group relative inline-block font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent hover:from-green-300 hover:to-blue-300 transition-all duration-300"
                  >
                    Jelentkezés szolgáltatónak
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to={createPageUrl("ShelterApplication")} 
                    className="group relative inline-block font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent hover:from-green-300 hover:to-blue-300 transition-all duration-300"
                  >
                    Regisztráció menhelyeknek
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li className="pt-2">
                  <a href="tel:+36301234567" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    +36 30 123 4567
                  </a>
                </li>
                <li>
                  <a href="mailto:info@mancspoint.hu" className="text-gray-300 hover:text-white transition-colors">
                    info@mancspoint.hu
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 MancsPont.hu Portál. Minden jog fenntartva. Készült szeretettel az állatokért. ❤️
            </p>
            <div className="flex space-x-6">
              <Link to={createPageUrl("Terms")} className="text-gray-400 hover:text-white text-sm transition-colors">
                Felhasználási feltételek
              </Link>
              <Link to={createPageUrl("Privacy")} className="text-gray-400 hover:text-white text-sm transition-colors">
                Adatvédelmi nyilatkozat
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

