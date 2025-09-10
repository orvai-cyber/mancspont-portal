import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Post, User } from '@/api/entities';
import { PenSquare, TrendingUp, Users, Hash, Filter, SlidersHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import CreatePostForm from '../components/community-feed/CreatePostForm';
import PostFeed from '../components/community-feed/PostFeed';
import CommunitySidebar from '../components/community-feed/CommunitySidebar';
import TrendingTopics from '../components/community-feed/TrendingTopics';
import CommunityFilters from '../components/community-feed/CommunityFilters';
import PostModal from '../components/community-feed/PostModal';

// Konstansok
const POSTS_PER_LOAD = 20;
const SEARCH_DEBOUNCE_MS = 300;

export default function CommunityFeedPage() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadData = useCallback(async (reset = false) => {
    if (reset) {
      setIsLoading(true);
      setPosts([]);
    } else {
      setIsLoadingMore(true);
    }
    
    setError(null);
    
    try {
      const [allPosts, user] = await Promise.all([
        Post.list('-created_date', reset ? POSTS_PER_LOAD : posts.length + POSTS_PER_LOAD),
        User.me().catch(() => null)
      ]);
      
      setPosts(allPosts);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading community data:', error);
      setError('Hiba történt a közösségi tartalom betöltésekor. Kérjük próbáld újra.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [posts.length]);

  useEffect(() => {
    loadData(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePostCreated = useCallback((newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
  }, []);

  const handlePostLike = useCallback(async (postId) => {
    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: (post.likes || 0) + 1, isLiked: !post.isLiked }
        : post
    ));
    
    // TODO: Implement actual API call
    try {
      // await PostAPI.toggleLike(postId);
    } catch (error) {
      // Revert optimistic update on error
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: (post.likes || 0) - 1, isLiked: !post.isLiked }
          : post
      ));
    }
  }, []);

  const handlePostDelete = useCallback((postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  const handleOpenPostModal = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  const handleClosePostModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  // Optimalizált közösségi statisztikák
  const communityStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPosts = posts.filter(post => {
      const postDate = new Date(post.created_date);
      postDate.setHours(0, 0, 0, 0);
      return postDate.getTime() === today.getTime();
    }).length;

    const uniqueAuthors = new Set(posts.map(post => post.author_name)).size;
    
    return {
      todayPosts,
      activeMembers: uniqueAuthors,
      newMembers: 18 // Mock data - kellene egy User creation tracking
    };
  }, [posts]);

  // Retry function
  const handleRetry = useCallback(() => {
    loadData(true);
  }, [loadData]);

  // Error állapot kezelése
  if (error && isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Hiba történt</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleRetry} variant="outline">Újrapróbálás</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 lg:top-20 z-30 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Közösség</h1>
              <p className="text-gray-600">Oszd meg történeteid és tapasztalataid!</p>
            </div>
            
            {currentUser ? (
              <Button 
                onClick={() => setShowCreatePost(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={showCreatePost}
              >
                <PenSquare className="w-4 h-4 mr-2" />
                Új bejegyzés
              </Button>
            ) : (
              <Button variant="outline" onClick={() => User.login()}>
                Belépés a posztoláshoz
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex gap-8">
        
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-[280px] xl:w-[320px] flex-shrink-0 py-8">
          <div className="sticky top-32 space-y-6">
            <CommunitySidebar 
              currentUser={currentUser} 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <CommunityFilters 
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 min-w-0">
          <div className="h-full overflow-y-auto py-8 pr-4 space-y-6">
            
            {/* Mobile Filters + Search */}
            <div className="lg:hidden">
              <Accordion type="single" collapsible className="w-full bg-white rounded-xl p-2 border border-gray-100 shadow-md">
                <AccordionItem value="filters" className="border-b-0">
                  <AccordionTrigger className="px-4 py-2 text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-3">
                      <SlidersHorizontal className="w-5 h-5 text-purple-600" />
                      <span>Szűrők és menü</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    {/* Mobile Search */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Keresés</h4>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <Input
                          type="text"
                          placeholder="Keress bejegyzések között..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-full bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:border-purple-400 focus:ring-purple-400"
                        />
                      </div>
                    </div>
                    
                    <CommunitySidebar currentUser={currentUser} />
                    <CommunityFilters 
                      activeFilter={activeFilter}
                      onFilterChange={setActiveFilter}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Create Post Form */}
            {showCreatePost && currentUser && (
              <CreatePostForm 
                currentUser={currentUser}
                onPostCreated={handlePostCreated}
                onCancel={() => setShowCreatePost(false)}
              />
            )}

            {/* Posts Feed */}
            <PostFeed 
              posts={posts}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              currentUser={currentUser}
              onPostLike={handlePostLike}
              onPostDelete={handlePostDelete}
              onPostClick={handleOpenPostModal}
              onLoadMore={() => loadData(false)}
              activeFilter={activeFilter}
              sortBy={sortBy}
              searchQuery={debouncedSearch}
              hasError={!!error}
              onRetry={handleRetry}
            />
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-[280px] xl:w-[320px] flex-shrink-0 py-8">
          <div className="sticky top-32 space-y-6">
            <TrendingTopics posts={posts} />
            
            <Card className="shadow-md border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Közösségi statisztikák
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mai bejegyzések</span>
                  <span className="font-semibold text-green-600">{communityStats.todayPosts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Aktív tagok</span>
                  <span className="font-semibold text-blue-600">{communityStats.activeMembers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Új tagok (hét)</span>
                  <span className="font-semibold text-purple-600">{communityStats.newMembers}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {currentUser && (
              <Card className="shadow-md border border-gray-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Hash className="w-5 h-5 text-purple-600" />
                    Gyors műveletek
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowCreatePost(true)}
                    disabled={showCreatePost}
                  >
                    <PenSquare className="w-4 h-4 mr-2" />
                    Poszt írása
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveFilter('segitsegkeres')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Kérdés feltevése
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveFilter('orokbefogadas_tortenet')}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Sikertörténet megosztása
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </aside>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={handleClosePostModal} 
          currentUser={currentUser} 
        />
      )}
    </div>
  );
}