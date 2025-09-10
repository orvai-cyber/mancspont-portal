import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthorBio({ author }) {
  // Mock author data
  const authorData = {
    name: author,
    bio: 'Állatorvos és viselkedésterapeuta, több mint 10 éves tapasztalattal az állatok mentésében és rehabilitációjában. Rendszeresen tart előadásokat és workshopokat.',
    avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${author}`,
    articles: 23,
    specialty: 'Állatviselkedés és rehabilitáció'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mb-12"
    >
      <Card className="border-2 border-green-100 bg-gradient-to-r from-green-50 to-white">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg mx-auto sm:mx-0">
              <AvatarImage src={authorData.avatar} />
              <AvatarFallback className="text-lg">{authorData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-grow text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{authorData.name}</h3>
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-green-700 font-medium mb-3">{authorData.specialty}</p>
              <p className="text-gray-600 leading-relaxed mb-4">{authorData.bio}</p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-green-600">{authorData.articles}</span> publikált cikk
                </div>
                <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50">
                  <User className="w-4 h-4 mr-2" />
                  Szerző követése
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}