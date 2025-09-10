
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, MessageSquare, ArrowRight, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const StoryCard = ({ post, featured = false }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="group"
  >
    <Link to={createPageUrl(`PostDetails?id=${post.id}`)} className="block">
      <Card className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden h-full flex flex-col ${featured ? 'bg-gradient-to-br from-yellow-50 to-white' : 'bg-white'}`}>
        {post.photos && post.photos.length > 0 && (
          <div className="relative">
            <img 
              src={post.photos[0]}
              alt={post.title}
              className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${featured ? 'h-56' : 'h-48'}`}
            />
            {featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Award className="w-3 h-3 mr-1" />
                  Kiemelt bejegyzés
                </Badge>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow">
              <Heart className="w-4 h-4 text-red-500" />
            </div>
          </div>
        )}
        <CardContent className={`flex-grow flex flex-col ${featured ? 'p-8' : 'p-6'}`}>
          <div className="flex items-center gap-3 mb-4 group-hover:opacity-80 transition-opacity">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${post.author_name}`} />
              <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{post.author_name}</p>
              <p className="text-xs text-gray-500">Boldog gazdi</p>
            </div>
          </div>
          
          <h3 className={`font-bold text-gray-900 mb-4 flex-grow group-hover:text-purple-700 transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
            {post.title}
          </h3>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{post.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>12</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

const StoryCardSkeleton = ({ featured = false }) => (
  <Card className={`rounded-2xl shadow-lg border-0 h-full flex flex-col`}>
    <Skeleton className={`w-full ${featured ? 'h-56' : 'h-48'}`} />
    <CardContent className={`flex-grow flex flex-col ${featured ? 'p-8' : 'p-6'}`}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className={`w-full mb-3 ${featured ? 'h-6' : 'h-5'}`} />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex items-center justify-between mt-auto">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </CardContent>
  </Card>
);

export default function FeaturedStories({ posts, isLoading }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Kiemelt bejegyzések</h2>
          <p className="text-gray-600">A közösség által leginkább kedvelt sikertörténetek</p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          {posts.length} történet
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <StoryCardSkeleton key={i} featured={i === 0} />)
        ) : (
          posts.map((post, index) => (
            <StoryCard key={post.id} post={post} featured={index === 0} />
          ))
        )}
      </div>
    </section>
  );
}
