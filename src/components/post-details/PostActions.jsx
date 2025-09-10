import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

export default function PostActions({ post }) {
    return (
        <div className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-semibold">{post.likes || 0}</span>
                <span className="hidden sm:inline">Tetszik</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">8</span>
                 <span className="hidden sm:inline">Hozzászólás</span>
            </Button>
            <Button variant="outline" size="icon" className="ml-auto">
                <Share2 className="w-5 h-5 text-gray-500" />
            </Button>
        </div>
    );
}