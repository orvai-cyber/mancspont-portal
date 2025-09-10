import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageSquare, Edit, Award } from 'lucide-react';

export default function ProfileStats({ profile, posts }) {
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const postsThisMonth = posts.filter(post => {
    const postDate = new Date(post.created_date);
    const thisMonth = new Date();
    return postDate.getMonth() === thisMonth.getMonth() && 
           postDate.getFullYear() === thisMonth.getFullYear();
  }).length;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Közösségi aktivitás
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Edit className="w-4 h-4 text-purple-600 mr-1" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{posts.length}</p>
            <p className="text-xs text-gray-500">Összes poszt</p>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Heart className="w-4 h-4 text-red-600 mr-1" />
            </div>
            <p className="text-2xl font-bold text-red-600">{totalLikes}</p>
            <p className="text-xs text-gray-500">Összesít kedvelés</p>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <MessageSquare className="w-4 h-4 text-blue-600 mr-1" />
            </div>
            <p className="text-2xl font-bold text-blue-600">89</p>
            <p className="text-xs text-gray-500">Hozzászólás</p>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Edit className="w-4 h-4 text-green-600 mr-1" />
            </div>
            <p className="text-2xl font-bold text-green-600">{postsThisMonth}</p>
            <p className="text-xs text-gray-500">E havi poszt</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}