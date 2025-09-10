
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, MessageSquare, Share2, MoreHorizontal, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { hu } from 'date-fns/locale';

export default function PostItem({ post, currentUser, onLike, onPostClick }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

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

  const typeIcons = {
    'orokbefogadas_tortenet': '❤️',
    'frissites': '📢',
    'segitsegkeres': '🆘',
    'tipp': '💡'
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Megakadályozza, hogy a kártya kattintás is lefusson
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  // Dinamikus tartalom-rövidítés
  const hasImage = post.photos && post.photos.length > 0;
  const maxContentLength = hasImage ? 150 : 300; // Ha van kép, a szöveg rövidebb
  const isTruncated = post.content.length > maxContentLength;

  const truncatedContent = isTruncated
    ? post.content.substring(0, maxContentLength) + '...'
    : post.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onPostClick(post)} // Kattintás a modal megnyitásához
      className="cursor-pointer"
    >
      <Card className="shadow-lg border border-gray-100/50 hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-0">
          {/* Post Header */}
          <div className="px-6 pt-6 pb-4 flex items-start justify-between group">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <Avatar className="flex-shrink-0">
                <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${post.author_name}`} />
                <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <Link 
                    to={createPageUrl(`UserProfile?author=${encodeURIComponent(post.author_name)}`)}
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-gray-900 hover:text-purple-700 transition-colors"
                  >
                    {post.author_name}
                  </Link>
                  
                  <Badge className={typeColors[post.post_type] || 'bg-gray-100 text-gray-800'}>
                    <span className="mr-1">{typeIcons[post.post_type]}</span>
                    {typeLabels[post.post_type] || post.post_type}
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatDistanceToNow(new Date(post.created_date), { 
                        addSuffix: true, 
                        locale: hu 
                      })}
                    </span>
                  </div>
                </div>
                
                {post.animal_name && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Állat:</span> {post.animal_name}
                  </p>
                )}
              </div>
            </div>
              
            <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Post Content */}
          <div className="px-6 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
              {post.title}
            </h3>
            
            <div className="text-gray-700 leading-relaxed">
              {showFullContent || !isTruncated ? (
                <p>{post.content}</p>
              ) : (
                <>
                  <p>{truncatedContent}</p>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowFullContent(true);
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium mt-2 text-sm"
                  >
                    Több megjelenítése
                  </button>
                </>
              )}
            </div>
          </div>

          {post.photos && post.photos.length > 0 && (
            <div className="px-6 pb-4">
              <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                {post.photos.slice(0, 4).map((photo, index) => (
                  <div key={index} className={`relative ${post.photos.length === 1 ? 'col-span-2' : ''}`}>
                    <img 
                      src={photo}
                      alt={`${post.title} - ${index + 1}`}
                      className="w-full h-auto max-h-[500px] min-h-[150px] object-cover"
                      style={{ 
                        aspectRatio: post.photos.length === 1 ? 'auto' : 'auto' 
                      }}
                    />
                    {index === 3 && post.photos.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          +{post.photos.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post Actions */}
          <div className="px-6 py-4 border-t border-gray-100"> 
            <div className="flex items-center justify-between text-gray-500">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-colors hover:text-red-600 ${
                    isLiked ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{post.likes || 0}</span>
                </button>
                
                <div
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">8 hozzászólás</span>
                </div>
                
                <button className="flex items-center gap-2 hover:text-green-600 transition-colors" onClick={(e) => e.stopPropagation()}>
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Megosztás</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
