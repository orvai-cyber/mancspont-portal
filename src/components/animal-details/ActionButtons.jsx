
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { Favorite } from '@/api/entities';
import { Heart, Share2, MessageSquare, AlertTriangle, Facebook, Twitter, Mail, Copy } from 'lucide-react'; // Changed MessageCircle to MessageSquare
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export default function ActionButtons({ animal }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        
        if (user && animal?.id) {
          await checkFavoriteStatus(user.id, animal.id);
        }
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [animal?.id]);

  const checkFavoriteStatus = async (userId, animalId) => {
    try {
      const favorites = await Favorite.filter({ 
        user_id: userId, 
        animal_id: animalId 
      });
      setIsFavorited(favorites.length > 0);
    } catch (error) {
      console.error("Failed to check favorite status:", error);
      setIsFavorited(false);
    }
  };

  const toggleFavorite = async () => {
    if (!currentUser) {
      toast.error("Kérjük, jelentkezzen be a kedvencek mentéséhez.");
      return;
    }
    if (!animal?.id) {
      toast.error("Hiba történt: Az állat adatai nem elérhetők.");
      return;
    }

    try {
      if (isFavorited) {
        const favorites = await Favorite.filter({ 
          user_id: currentUser.id, 
          animal_id: animal.id 
        });
        if (favorites.length > 0) {
          await Favorite.delete(favorites[0].id);
          toast.success("Eltávolítva a kedvencek közül.");
        }
      } else {
        await Favorite.create({
          user_id: currentUser.id,
          user_email: currentUser.email,
          animal_id: animal.id,
          animal_name: animal.name,
          animal_photo: animal.photos?.[0] || '',
          shelter_name: animal.shelter_name
        });
        toast.success("Hozzáadva a kedvencekhez!");
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Failed to toggle favorite status:", error);
      toast.error("Sikertelen művelet. Kérjük, próbálja újra.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link másolva a vágólapra!'))
      .catch(() => toast.error('A link másolása sikertelen.'));
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Nézd meg ezt az állatot: ${animal.name}! Találj neki otthont!`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(`Nézd meg ezt az állatot: ${animal.name}`);
    const body = encodeURIComponent(`Szia!\n\nNézd meg ezt az állatot: ${animal.name}!\nTaláld meg neki otthont: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to={createPageUrl(`AdoptionForm?animalId=${animal.id}`)}>
          <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg hover:shadow-xl transition-all">
            <Heart className="w-5 h-5 mr-2" />
            Örökbe fogadom
          </Button>
        </Link>
        
        <Button 
          size="lg" 
          variant="outline" 
          className="w-full border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white font-bold transition-colors"
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          <Heart className={`w-5 h-5 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
          {isLoading ? 'Betöltés...' : (isFavorited ? 'Kedvenc' : 'Kedvencekhez')}
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Megosztás
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Megosztás</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <Button variant="outline" size="icon" onClick={shareToFacebook} className="h-12">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </Button>
                <Button variant="outline" size="icon" onClick={shareToTwitter} className="h-12">
                  <Twitter className="w-5 h-5 text-sky-500" />
                </Button>
                <Button variant="outline" size="icon" onClick={shareByEmail} className="h-12">
                  <Mail className="w-5 h-5 text-gray-600" />
                </Button>
                <Button variant="outline" size="icon" onClick={copyToClipboard} className="h-12">
                  <Copy className="w-5 h-5 text-gray-600" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input 
                  value={window.location.href} 
                  readOnly 
                  className="flex-1"
                />
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button
          size="lg"
          variant="outline"
          className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300" // Updated className
        >
          <MessageSquare className="w-5 h-5 mr-2" /> {/* Changed MessageCircle to MessageSquare */}
          Üzenet
        </Button>
      </div>

      {/* Urgent Alert */}
      {animal.is_urgent && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">Sürgős örökbefogadás szükséges!</span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            Ennek az állatnak sürgősen otthont kell találni. Kérjük, ha teheti, segítsen!
          </p>
        </div>
      )}
    </div>
  );
}
