import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PostsGrid({ posts }) {
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
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Saját bejegyzések</h2>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {posts.length} bejegyzés
        </Badge>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">Még nincsenek bejegyzések.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={createPageUrl(`PostDetails?id=${post.id}`)}>
                <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group cursor-pointer">
                  {post.photos && post.photos.length > 0 && (
                    <div className="relative">
                      <img 
                        src={post.photos[0]}
                        alt={post.title}
                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-4">
                    <Badge className={`${typeColors[post.post_type] || 'bg-gray-100 text-gray-800'} mb-2`}>
                      {typeLabels[post.post_type] || post.post_type}
                    </Badge>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{post.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>8</span>
                        </div>
                      </div>
                      <span>{new Date(post.created_date).toLocaleDateString('hu-HU')}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}