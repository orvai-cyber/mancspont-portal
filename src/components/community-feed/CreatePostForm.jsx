
import React, { useState } from 'react';
import { Post } from '@/api/entities';
import { Camera, MapPin, X, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

export default function CreatePostForm({ currentUser, onPostCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    post_type: 'orokbefogadas_tortenet',
    animal_name: '',
    photos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const postData = {
        ...formData,
        author_name: currentUser.full_name
      };
      
      const newPost = await Post.create(postData);
      onPostCreated(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setIsSubmitting(false);
  };

  const postTypes = {
    'orokbefogadas_tortenet': { label: 'Sikertörténet', icon: '❤️' },
    'frissites': { label: 'Frissítés', icon: '📢' },
    'segitsegkeres': { label: 'Segítségkérés', icon: '🆘' },
    'tipp': { label: 'Tipp', icon: '💡' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="shadow-2xl border border-gray-200 rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <img 
                src={currentUser.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.full_name}`}
                alt={currentUser.full_name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{currentUser.full_name}</p>
                <p className="text-sm text-gray-500 font-normal">Bejegyzés létrehozása</p>
              </div>
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Post Type */}
            <div>
              <Label htmlFor="post-type" className="text-sm font-medium">Bejegyzés típusa</Label>
              <Select value={formData.post_type} onValueChange={(value) => setFormData({...formData, post_type: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(postTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium">Cím</Label>
              <Input
                id="title"
                placeholder="Adj címet a bejegyzésednek..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="mt-1"
                required
              />
            </div>

            {/* Animal Name */}
            {formData.post_type === 'orokbefogadas_tortenet' && (
              <div>
                <Label htmlFor="animal-name" className="text-sm font-medium">Állat neve</Label>
                <Input
                  id="animal-name"
                  placeholder="Az állat neve..."
                  value={formData.animal_name}
                  onChange={(e) => setFormData({...formData, animal_name: e.target.value})}
                  className="mt-1"
                />
              </div>
            )}

            {/* Content */}
            <div>
              <Textarea
                placeholder="Oszd meg történetedet, tapasztalataidat..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="min-h-32 resize-none"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" className="text-gray-600">
                  <Camera className="w-4 h-4 mr-2" />
                  Fotó
                </Button>
                <Button type="button" variant="ghost" size="sm" className="text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  Helyszín
                </Button>
                <Button type="button" variant="ghost" size="sm" className="text-gray-600">
                  <Smile className="w-4 h-4 mr-2" />
                  Hangulat
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Mégse
                </Button>
                <Button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                >
                  {isSubmitting ? 'Közzététel...' : 'Közzététel'}
                </Button>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
    </motion.div>
  );
}
