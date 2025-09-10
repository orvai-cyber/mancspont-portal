import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Heart, Reply, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommentSection({ articleId }) {
  const [newComment, setNewComment] = useState('');
  const [comments] = useState([
    {
      id: 1,
      author: 'Kovács Anna',
      content: 'Nagyon hasznos cikk! A mi kutyusunkkal is hasonló tapasztalataink voltak az első hetekben.',
      date: '2024-01-15',
      likes: 5,
      avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Kovács Anna'
    },
    {
      id: 2,
      author: 'Nagy Péter',
      content: 'Köszönöm a tippeket! Pont jókor jött ez a cikk, mert hétvégén örökbefogadunk egy kiskutyát.',
      date: '2024-01-14',
      likes: 3,
      avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Nagy Péter'
    },
    {
      id: 3,
      author: 'Szabó Mária',
      content: 'A türelem valóban kulcsfontosságú. Nálunk 3 hét alatt szokta meg az új környezetet Luna.',
      date: '2024-01-14',
      likes: 8,
      avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Szabó Mária'
    }
  ]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      console.log('New comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="border-t-2 border-gray-100 pt-12"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MessageSquare className="w-6 h-6 text-green-600" />
            Hozzászólások ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Írj hozzászólást</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Oszd meg a tapasztalataidat vagy tedd fel a kérdésedet..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Küldés
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                        <Heart className="w-4 h-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600">
                        <Reply className="w-4 h-4 mr-1" />
                        Válasz
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}