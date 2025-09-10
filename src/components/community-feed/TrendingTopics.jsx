
import React, { useMemo } from 'react';
import { TrendingUp, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TrendingTopics({ posts }) {
  const trendingTopics = useMemo(() => {
    const topics = [
      { name: 'örökbefogadás', count: 23, trend: '+12%' },
      { name: 'kutyakiképzés', count: 18, trend: '+8%' },
      { name: 'állatmentés', count: 15, trend: '+15%' },
      { name: 'egészség', count: 12, trend: '+5%' },
      { name: 'macskák', count: 10, trend: '+3%' }
    ];
    
    return topics.slice(0, 5);
  }, []);

  const recentTopPosts = useMemo(() => {
    return posts
      .filter(p => p.likes > 10)
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 3);
  }, [posts]);

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Népszerű témák
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">#{topic.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{topic.count}</div>
                <div className="text-xs text-green-600">{topic.trend}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Popular Posts */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Népszerű bejegyzések
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentTopPosts.map((post, index) => (
            <div key={post.id} className="border-l-2 border-orange-200 pl-3 hover:border-orange-400 transition-colors cursor-pointer">
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{post.author_name}</span>
                <span>•</span>
                <Badge variant="secondary" className="text-xs">
                  {post.likes} kedvelés
                </Badge>
              </div>
            </div>
          ))}
          
          {recentTopPosts.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Még nincsenek népszerű bejegyzések.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
