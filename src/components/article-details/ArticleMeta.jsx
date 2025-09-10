import React from 'react';
import { Clock, User, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ArticleMeta({ article }) {
  const categoryLabels = {
    'allattartas': 'Állattartás',
    'neveles': 'Nevelés',
    'egeszseg': 'Egészség',
    'jogi_tudnivalok': 'Jogi tudnivalók',
    'orokbefogadas': 'Örökbefogadás',
    'tippek': 'Tippek'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4" />
        <span className="font-medium">{article.author}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(article.created_date)}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span>{article.read_time || 5} perc olvasás</span>
      </div>

      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4" />
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {categoryLabels[article.category] || article.category}
        </Badge>
      </div>
    </div>
  );
}