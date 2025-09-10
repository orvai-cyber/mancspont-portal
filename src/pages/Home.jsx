
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Animal, Shelter, Event, Post, Article } from "@/api/entities";
import {
  Search,
  Heart,
  PawPrint,
  Calendar,
  MapPin,
  ArrowRight,
  Star,
  Users,
  Sparkles,
  Gift,
  ShoppingBag,
  BookOpen,
  TrendingUp,
  Award,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import HeroSearch from "../components/home/HeroSearch";
import FeaturedAnimals from "../components/home/FeaturedAnimals";
import FeaturedShelters from "../components/home/FeaturedShelters";
import DonationSection from "../components/home/DonationSection";
import UpcomingEvents from "../components/home/UpcomingEvents";
import CommunityStories from "../components/home/CommunityStories";
import LatestArticles from "../components/home/LatestArticles";
import ShopSection from "../components/home/ShopSection";
import PartnersSection from "../components/home/PartnersSection";
import StatsSection from "../components/home/StatsSection";
import ServicesSection from "../components/home/ServicesSection";

// Konstansok
const DATA_LIMITS = {
  ANIMALS: 6,
  SHELTERS: 4,
  EVENTS: 4,
  POSTS: 4,
  ARTICLES: 3
};

export default function Home() {
  const [data, setData] = useState({
    animals: [],
    shelters: [],
    events: [],
    posts: [],
    articles: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Optimalizált adatbetöltés egyetlen függvényben
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Párhuzamos API hívások az optimális performance érdekében
      const [animalsData, sheltersData, eventsData, postsData, articlesData] = await Promise.allSettled([
        Animal.list('-created_date', DATA_LIMITS.ANIMALS),
        Shelter.filter({ is_featured: true }, '-created_date', DATA_LIMITS.SHELTERS),
        // Sorrend frissítése a legújabbra
        Event.list('-date', DATA_LIMITS.EVENTS),
        Post.list('-created_date', DATA_LIMITS.POSTS),
        Article.filter({ published: true }, '-created_date', DATA_LIMITS.ARTICLES)
      ]);

      // Eredmények feldolgozása error handling-gel
      const processResult = (result, fallback = []) => {
        if (result.status === 'fulfilled') {
          return Array.isArray(result.value) ? result.value : fallback;
        } else {
          console.warn('API call failed:', result.reason);
          return fallback;
        }
      };

      setData({
        animals: processResult(animalsData),
        shelters: processResult(sheltersData),
        events: processResult(eventsData),
        posts: processResult(postsData),
        articles: processResult(articlesData)
      });

    } catch (error) {
      console.error('Error loading homepage data:', error);
      setError('Hiba történt az adatok betöltésekor. Kérjük frissítse az oldalt.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Memoizált statisztikák a teljesítmény javítására
  const stats = useMemo(() => ({
    totalAnimals: data.animals.length,
    totalShelters: data.shelters.length,
    urgentAnimals: data.animals.filter(animal => animal.is_urgent).length,
    recentPosts: data.posts.length
  }), [data]);

  // Error állapot kezelése
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Hiba történt</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadAllData} variant="outline">Újrapróbálás</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-500/5 rounded-full blur-lg"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-orange-300" />
                <span className="text-sm font-medium">Magyarország #1 Állatmenhely Portálja</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Minden mancs egy
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
                történetet hordoz
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Minden örökbefogadás egy megmentett szív. Találd meg a társad és írjatok együtt új történetet.
            </p>

            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Animals */}
      <section className="pt-8 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <PawPrint className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-600 uppercase tracking-wide">Örökbefogadás</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Kik várják az új otthonukat?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fedezd fel a legújabb örökbefogadható állatokat, akik szerető gazdikra várnak
            </p>
          </div>

          <FeaturedAnimals animals={data.animals} isLoading={isLoading} />

          <div className="text-center mt-12">
            <Link to={createPageUrl("Animals")}>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                Összes gazdikereső
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Shelters */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium text-orange-600 uppercase tracking-wide">Partnereink</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Kiemelt menhelyek
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ismerd meg azokat a menhelyeket, akik nap mint nap dolgoznak az állatmentésért
            </p>
          </div>

          <FeaturedShelters shelters={data.shelters} isLoading={isLoading} />

          <div className="text-center mt-12">
            <Link to={createPageUrl("Shelters")}>
              <Button size="lg" variant="outline" className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 text-lg">
                Összes menhely megtekintése
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DonationSection />
        </div>
      </section>

      {/* Community Stories */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-600 uppercase tracking-wide">Közösség</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Legyél részese Te is a közösségünknek
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kedvenceink összekötnek minket. A közösségi oldalunkon ismerd meg más gazdik történeteit, kérj tanácsot, vagy csak oszd meg a legjobb pillanataid
            </p>
          </div>

          <CommunityStories posts={data.posts} isLoading={isLoading} />

          <div className="text-center mt-12">
            <Link to={createPageUrl("CommunityFeed")}>
              <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 text-lg">
                Csatlakozz a közösséghez
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Latest Articles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-600 uppercase tracking-wide">Tudás</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Friss cikkeink
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hasznos tippek, szakmai tanácsok és útmutatók az állattartáshoz és örökbefogadáshoz
            </p>
          </div>

          <LatestArticles articles={data.articles} isLoading={isLoading} />

          <div className="text-center mt-12">
            <Link to={createPageUrl("Blog")}>
              <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 text-lg">
                Összes cikk olvasása
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShopSection />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">Programok</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Közelgő események
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ne maradj le a legközelebbi örökbefogadó napokról és közösségi eseményekről
            </p>
          </div>

          <UpcomingEvents events={data.events} isLoading={isLoading} />

          <div className="text-center mt-12">
            <Link to={createPageUrl("Events")}>
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg">
                Teljes eseménynaptár
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PartnersSection />
        </div>
      </section>
    </div>
  );
}
