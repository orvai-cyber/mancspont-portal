import React from 'react';
import { Share2, Link as LinkIcon, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function ShareButtons({ article, likes = 0 }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link vágólapra másolva!');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link vágólapra másolva!');
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-medium">{likes} kedvelés</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <span className="font-medium">0 hozzászólás</span>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex-1 sm:flex-none"
          >
            <Share2 className="w-4 h-4 mr-2" />
            <span className="truncate">Megosztás</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex-1 sm:flex-none"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            <span className="truncate">Link</span>
          </Button>
        </div>
      </div>
    </div>
  );
}