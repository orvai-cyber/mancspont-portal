import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

export default function PostHeader({ post }) {
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
        <header className="mb-8 border-b pb-8 border-gray-100">
            <Badge className={`${typeColors[post.post_type] || 'bg-gray-100 text-gray-800'} mb-4`}>
                {typeLabels[post.post_type] || post.post_type}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${post.author_name}`} />
                        <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-gray-800">{post.author_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(post.created_date).toLocaleDateString('hu-HU')}</span>
                </div>
            </div>
        </header>
    );
}