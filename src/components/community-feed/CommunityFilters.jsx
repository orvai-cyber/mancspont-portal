
import React from 'react';
import { Filter, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CommunityFilters({ activeFilter, onFilterChange, sortBy, onSortChange }) {
  const filters = [
    { value: 'all', label: 'Minden bejegyzés', icon: '📝', count: 45 },
    { value: 'orokbefogadas_tortenet', label: 'Sikertörténetek', icon: '❤️', count: 12 },
    { value: 'segitsegkeres', label: 'Segítségkérések', icon: '🆘', count: 8 },
    { value: 'tipp', label: 'Tippek', icon: '💡', count: 15 },
    { value: 'frissites', label: 'Frissítések', icon: '📢', count: 10 }
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-5 h-5 text-purple-600" />
          Szűrők
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Tartalom típusa</h4>
          <div className="space-y-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                  activeFilter === filter.value
                    ? 'bg-purple-50 text-purple-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{filter.icon}</span>
                  <span className="font-medium">{filter.label}</span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Rendezés</h4>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Legújabb</span>
                </div>
              </SelectItem>
              <SelectItem value="popular">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Legnépszerűbb</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters */}
        {(activeFilter !== 'all' || sortBy !== 'recent') && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => {
              onFilterChange('all');
              onSortChange('recent');
            }}
          >
            Szűrők törlése
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
