
import React, { useState, useEffect } from 'react';
import { Post } from '@/api/entities';
import { Heart, Users, MessageSquare, Camera, TrendingUp, Award, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

import CommunityStats from '../components/community/CommunityStats';
import FeaturedStories from '../components/community/FeaturedStories';
import LatestPosts from '../components/community/LatestPosts';
import CommunityGuidelines from '../components/community/CommunityGuidelines';
import ShareYourStory from '../components/community/ShareYourStory';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setIsLoading(true);
    try {
      const [allPosts, topPosts] = await Promise.all([
        Post.list('-created_date', 12),
        Post.filter({ post_type: 'orokbefogadas_tortenet' }, '-likes', 3)
      ]);
      
      setPosts(allPosts);
      setFeaturedPosts(topPosts);
    } catch (error) {
      console.error('Error loading community data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-pink-300" />
                <span className="text-sm font-medium">Csatlakozz a közösséghez</span>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Itt a helye a 
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-yellow-300">
                Ti közös történeteteknek
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Oszd meg a történeted, egy vicces pillanatot vagy egy közös élményt kedvencedről! Inspirálj másokat és legyél része egy segítőkész közösségnek.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("CommunityFeed")}>
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl">
                  <Camera className="w-5 h-5 mr-2" />
                  Bejegyzés írása
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-white/50 text-white bg-white/10 hover:bg-white/20 hover:border-white px-8 py-3 text-lg backdrop-blur-sm" asChild>
                <Link to={createPageUrl("CommunityFeed")}>
                  <Users className="w-5 h-5 mr-2" />
                  Közösség böngészése
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <CommunityStats />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <FeaturedStories posts={featuredPosts} isLoading={isLoading} />
            <LatestPosts posts={posts} isLoading={isLoading} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="sticky top-24 space-y-8">
              <ShareYourStory />
              <CommunityGuidelines />
              
              {/* Quick Actions */}
              <Card className="shadow-lg border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <TrendingUp className="w-5 h-5" />
                    Gyors műveletek
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-left">
                    <Heart className="w-4 h-4 mr-2" />
                    Poszt írása
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Kérdés feltevése
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <Camera className="w-4 h-4 mr-2" />
                    Fotó megosztása
                  </Button>
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    Hónap hősei
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Kovács Anna", posts: 12, badge: "🏆" },
                      { name: "Nagy Péter", posts: 8, badge: "🥈" },
                      { name: "Szabó Mária", posts: 6, badge: "🥉" }
                    ].map((contributor, index) => (
                      <Link to={createPageUrl(`UserProfile?author=${encodeURIComponent(contributor.name)}`)} key={index} className="block group">
                        <div className="flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${contributor.name}`} />
                            <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-grow">
                            <p className="font-semibold text-sm group-hover:text-purple-700">{contributor.name}</p>
                            <p className="text-xs text-gray-500">{contributor.posts} poszt</p>
                          </div>
                          <span className="text-lg">{contributor.badge}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
