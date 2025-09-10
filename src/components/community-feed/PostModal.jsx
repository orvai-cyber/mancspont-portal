
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X, Heart, MessageSquare, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { hu } from 'date-fns/locale';

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

export default function PostModal({ post, onClose, currentUser }) {
  // A Hook hívásokat a komponens tetejére helyezzük, a feltételes return elé.
  const [isLiked, setIsLiked] = useState(false);

  // Ez a feltétel így már biztonságos, és megvédi a komponenst, ha mégis 'post' nélkül hívódna meg.
  if (!post) return null;

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    // onLike(post.id); // Ezt majd a CommunityFeed-ből kell átadni, ha kell
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${post.author_name}`} />
                  <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{post.author_name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatDistanceToNow(new Date(post.created_date), { addSuffix: true, locale: hu })}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Modal Content (Scrollable) */}
          <div className="p-6 flex-grow overflow-y-auto">
            <Badge className={`${typeColors[post.post_type]} mb-4`}>{typeLabels[post.post_type]}</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
            {post.photos && post.photos.length > 0 && (
              <img 
                src={post.photos[0]} 
                alt={post.title} 
                className="w-full h-auto max-h-[60vh] object-contain rounded-lg mb-4 bg-gray-100" 
              />
            )}
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">8 hozzászólás</span>
                </div>
              </div>
              <Link to={createPageUrl(`PostDetails?id=${post.id}`)} onClick={onClose}>
                <Button>
                  Tovább a teljes bejegyzéshez
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
