import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

export default function RelatedPosts({ posts }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Hasonló bejegyzések</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {posts.map(post => (
                    <Link 
                        to={createPageUrl(`PostDetails?id=${post.id}`)}
                        key={post.id} 
                        className="block p-3 rounded-lg hover:bg-gray-50"
                    >
                        <p className="font-semibold text-sm mb-1">{post.title}</p>
                        <p className="text-xs text-gray-500">Írta: {post.author_name}</p>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}