import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

const comments = [
    {
        author: 'Nagy Péter',
        content: 'Nagyon inspiráló történet! Sok boldogságot nektek Lunával! ❤️',
        date: '2 órája'
    },
    {
        author: 'Horváth Gábor',
        content: 'Nekünk is hasonlóan indult a mi kutyusunkkal. A türelem tényleg kulcsfontosságú. Gratulálok!',
        date: '1 órája'
    }
];

export default function CommentSection() {
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Hozzászólások (2)</h2>
            <div className="space-y-6 mb-8">
                {comments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${comment.author}`} />
                            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow bg-gray-50 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-sm">{comment.author}</p>
                                <p className="text-xs text-gray-500">{comment.date}</p>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Szólj hozzá te is!</h3>
                 <div className="relative">
                    <Textarea placeholder="Írd le a gondolataidat..." className="pr-28" rows={3}/>
                    <Button size="icon" className="absolute top-1/2 right-3 transform -translate-y-1/2">
                        <Send className="w-4 h-4"/>
                    </Button>
                </div>
            </div>
        </div>
    );
}