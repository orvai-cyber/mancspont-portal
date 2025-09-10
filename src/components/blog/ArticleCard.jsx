
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const categoryColors = {
  allattartas: 'bg-blue-100 text-blue-800',
  neveles: 'bg-orange-100 text-orange-800',
  egeszseg: 'bg-green-100 text-green-800',
  jogi_tudnivalok: 'bg-red-100 text-red-800',
  orokbefogadas: 'bg-purple-100 text-purple-800',
  tippek: 'bg-yellow-100 text-yellow-800',
};

const categoryLabels = {
    allattartas: 'Állattartás',
    neveles: 'Nevelés',
    egeszseg: 'Egészség',
    jogi_tudnivalok: 'Jogi tudnivalók',
    orokbefogadas: 'Örökbefogadás',
    tippek: 'Tippek & Trükkök'
};

export default function ArticleCard({ article }) {
  return (
    <Link to={createPageUrl(`ArticleDetails?id=${article.id}`)} className="block group h-full">
      <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden bg-white h-full flex flex-col">
        <img 
          src={article.featured_image}
          alt={article.title}
          className="h-56 w-full object-cover"
        />
        <CardContent className="p-6 flex-grow flex flex-col">
          <Badge variant="secondary" className={`w-fit mb-3 ${categoryColors[article.category] || 'bg-gray-100'}`}>
            {categoryLabels[article.category] || article.category}
          </Badge>
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex-grow group-hover:text-green-700 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t">
            <span className="font-medium">Írta: {article.author}</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.read_time} perc</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export const ArticleCardSkeleton = () => (
  <Card className="rounded-2xl shadow-lg border-0 h-full flex flex-col">
    <Skeleton className="h-56 w-full" />
    <CardContent className="p-6 flex-grow flex flex-col">
      <Skeleton className="h-6 w-24 rounded-full mb-3" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-5 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex items-center justify-between mt-auto pt-4 border-t">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </CardContent>
  </Card>
);
