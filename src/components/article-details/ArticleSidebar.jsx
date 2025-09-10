import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Tag, TrendingUp, BookOpen, Users } from 'lucide-react';

export default function ArticleSidebar() {
  const popularTags = [
    'örökbefogadás', 'kutyanevelés', 'macska egészség', 
    'állat viselkedés', 'táplálkozás', 'játék'
  ];

  const recentArticles = [
    'Macskák rejtélyes viselkedése',
    'Kutyasétáltatás télen',
    'Allergiás reakciók jelei',
    'Pozitív megerősítés'
  ];

  return (
    <div className="space-y-6">
      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
        <CardContent className="p-6 text-center">
          <Mail className="w-8 h-8 mx-auto mb-4 text-green-100" />
          <h3 className="font-bold text-lg mb-2">Hírlevél</h3>
          <p className="text-green-100 text-sm mb-4">
            Hetente egyszer a legjobb cikkek
          </p>
          <div className="space-y-2">
            <Input 
              placeholder="Email címed"
              className="bg-white/90 text-gray-800 border-0"
            />
            <Button 
              variant="secondary" 
              className="w-full bg-yellow-400 text-green-800 hover:bg-yellow-500"
            >
              Feliratkozom
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="w-5 h-5 text-green-600" />
            Népszerű témák
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="cursor-pointer hover:bg-green-100 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-green-600" />
            Friss cikkek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentArticles.map((title, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-gray-200 hover:border-green-400"
              >
                <h4 className="font-medium text-sm text-gray-800 hover:text-green-700">
                  {title}
                </h4>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-purple-600" />
            Közösség
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Aktív olvasók</span>
              <span className="font-bold text-purple-600">12,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Heti cikkek</span>
              <span className="font-bold text-purple-600">8-10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Szakértők</span>
              <span className="font-bold text-purple-600">15+</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}