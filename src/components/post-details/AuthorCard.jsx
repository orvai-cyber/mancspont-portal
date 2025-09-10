import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';


export default function AuthorCard({ authorName, authorAvatar, postCount }) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-purple-600" />
          A poszt szerzője
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
            <Link to={createPageUrl(`UserProfile?author=${encodeURIComponent(authorName)}`)} className="group">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-md group-hover:border-purple-200 transition-colors">
                    <AvatarImage src={authorAvatar} />
                    <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{authorName}</h3>
            </Link>
          <p className="text-sm text-gray-500 mb-4">{postCount} bejegyzés</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Üzenet
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Követés
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}