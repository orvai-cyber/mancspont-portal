import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';

export default function TrendingPosts({ posts, isLoading }) {
  // Cikkek randomizálása
  const randomizedPosts = React.useMemo(() => {
    if (!posts || posts.length === 0) return [];
    return [...posts].sort(() => Math.random() - 0.5);
  }, [posts]);

  return (
    <Card className="shadow-xl shadow-gray-200/50 rounded-2xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-green-600" />
          Cikkajánló
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading 
            ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
            : randomizedPosts.map((post, index) => (
                <Link key={post.id} to={createPageUrl(`ArticleDetails?id=${post.id}`)} className="block group">
                  <div className="flex items-start gap-4 p-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                    <span className="text-2xl font-bold text-gray-300 group-hover:text-green-600 transition-colors">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-800 leading-tight group-hover:text-green-700 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {post.author}
                      </p>
                    </div>
                  </div>
                </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}