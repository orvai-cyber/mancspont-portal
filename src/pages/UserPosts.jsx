import React, { useState, useEffect } from 'react';
import { Post } from '@/api/entities';
import { User } from '@/api/entities';
import UserLayout from '../components/user/UserLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  FileText, 
  Plus, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const postTypeConfig = {
  orokbefogadas_tortenet: { label: 'Sikertörténet', color: 'bg-green-100 text-green-800', icon: Heart },
  frissites: { label: 'Frissítés', color: 'bg-blue-100 text-blue-800', icon: FileText },
  segitsegkeres: { label: 'Segítségkérés', color: 'bg-red-100 text-red-800', icon: MessageSquare },
  tipp: { label: 'Tipp', color: 'bg-purple-100 text-purple-800', icon: Eye }
};

export default function UserPostsPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        const userPosts = await Post.filter({ author_name: currentUser.full_name }, '-created_date');
        setPosts(userPosts);
        setFilteredPosts(userPosts);
      } catch (error) {
        console.error('Hiba a bejegyzések betöltésekor:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [posts, searchTerm]);

  const getPostStats = () => {
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const typeStats = posts.reduce((acc, post) => {
      acc[post.post_type] = (acc[post.post_type] || 0) + 1;
      return acc;
    }, {});
    
    return { totalLikes, typeStats };
  };

  const { totalLikes, typeStats } = getPostStats();

  if (isLoading) {
    return (
      <UserLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
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
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bejegyzéseim</h1>
            <p className="text-gray-600 mt-2">Az általam megosztott történetek és bejegyzések</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Új bejegyzés
          </Button>
        </div>

        {/* Statisztikák */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Összes bejegyzés</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Összes kedvelés</p>
                  <p className="text-2xl font-bold text-gray-900">{totalLikes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Hozzászólások</p>
                  <p className="text-2xl font-bold text-gray-900">47</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Megtekintések</p>
                  <p className="text-2xl font-bold text-gray-900">1.2k</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Keresés */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Keresés a bejegyzéseid között..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bejegyzések listája */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const typeInfo = postTypeConfig[post.post_type];
              const TypeIcon = typeInfo?.icon || FileText;
              
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className={`${typeInfo?.color} flex items-center gap-1`}>
                              <TypeIcon className="w-3 h-3" />
                              {typeInfo?.label}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {post.created_date 
                                ? format(new Date(post.created_date), 'yyyy. MM. dd.', { locale: hu })
                                : 'Ismeretlen dátum'
                              }
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            <Link 
                              to={createPageUrl(`PostDetails?id=${post.id}`)}
                              className="hover:text-green-600 transition-colors"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.content.substring(0, 200)}...
                          </p>
                          
                          {post.photos && post.photos.length > 0 && (
                            <div className="flex gap-2 mb-4">
                              {post.photos.slice(0, 3).map((photo, idx) => (
                                <img 
                                  key={idx}
                                  src={photo} 
                                  alt={`${post.title} - ${idx + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border"
                                />
                              ))}
                              {post.photos.length > 3 && (
                                <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center text-xs text-gray-500">
                                  +{post.photos.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes || 0} kedvelés</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>12 hozzászólás</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>156 megtekintés</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? 'Nincs találat' : 'Még nincsenek bejegyzéseid'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Próbálj meg másik keresőszót használni.' 
                : 'Oszd meg első történeted vagy tipped a közösséggel!'
              }
            </p>
            {!searchTerm && (
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Első bejegyzés írása
              </Button>
            )}
          </Card>
        )}
      </motion.div>
    </UserLayout>
  );
}