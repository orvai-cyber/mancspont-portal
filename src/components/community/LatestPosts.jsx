
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PostCard = ({ post }) => {
  const typeColors = {
    'orokbefogadas_tortenet': 'bg-green-100 text-green-800',
    'frissites': 'bg-blue-100 text-blue-800',
    'segitsegkeres': 'bg-red-100 text-red-800',
    'tipp': 'bg-purple-100 text-purple-800'
  };

  const typeLabels = {
    'orokbefogadas_tortenet': 'Sikertörténet',
    'frissites': 'Frissítés',
    'segitsegkeres': 'Segítségkérés',
    'tipp': 'Tipp'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Link to={createPageUrl(`PostDetails?id=${post.id}`)} className="block">
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-0 bg-white mb-6 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="flex-shrink-0">
                <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${post.author_name}`} />
                <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  {/* Author name is now just text, as the whole card is clickable */}
                  <p className="font-semibold text-gray-900 hover:text-purple-700 transition-colors">{post.author_name}</p>
                  <Badge className={typeColors[post.post_type] || 'bg-gray-100 text-gray-800'}>
                    {typeLabels[post.post_type] || post.post_type}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>2 órája</span>
                  </div>
                </div>
                
                {/* Title is now just text, as the whole card is clickable */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-purple-700 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content.substring(0, 200)}...
                </p>
                
                {post.photos && post.photos.length > 0 && (
                  <div className="mb-4">
                    <img 
                      src={post.photos[0]}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  {/* Likes and comments are now simple divs, not interactive buttons/links, as the whole card is clickable */}
                  <div className="flex items-center gap-2 hover:text-red-600 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes || 0} kedvelés</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>8 hozzászólás</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const PostCardSkeleton = () => (
  <Card className="rounded-2xl shadow-md border-0 bg-white mb-6">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex-grow space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function LatestPosts({ posts, isLoading }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Legújabb bejegyzések</h2>
          <p className="text-gray-600">Friss történetek, tippek és tapasztalatok a közösségtől</p>
        </div>
        <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white" asChild>
          <Link to={createPageUrl("CommunityFeed")}>
            Összes megtekintése
          </Link>
        </Button>
      </div>
      
      <div className="space-y-0">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <PostCardSkeleton key={i} />)
        ) : (
          posts.slice(0, 6).map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
      
      {!isLoading && posts.length > 6 && (
        <div className="text-center mt-8">
          <Link to={createPageUrl("CommunityFeed")}>
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8">
              További bejegyzések betöltése
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
