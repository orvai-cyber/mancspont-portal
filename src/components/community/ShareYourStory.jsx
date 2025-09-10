import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Heart, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ShareYourStory() {
  return (
    <Card className="shadow-xl border-pink-200 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Heart className="w-6 h-6 text-pink-600" />
          Oszd meg történeted!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Csatlakozz a beszélgetéshez! Töltsd fel kedvenced képeit, oszd meg tapasztalataidat, és kapcsolódj más gazdikhoz.
        </p>
        
        <div className="space-y-3">
          <Link to={createPageUrl("CommunityFeed")}>
            <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white justify-start">
              <Edit className="w-4 h-4 mr-2" />
              Bejegyzés írása
            </Button>
          </Link>
          
          <Link to={createPageUrl("CommunityFeed")}>
            <Button variant="outline" className="w-full justify-start border-pink-200 text-pink-700 hover:bg-pink-50">
              <Camera className="w-4 h-4 mr-2" />
              Fotó feltöltése
            </Button>
          </Link>
        </div>
        
        <div className="bg-pink-50 p-4 rounded-lg">
          <p className="text-xs text-pink-800 font-medium mb-2">💡 Tipp:</p>
          <p className="text-xs text-pink-700">
            A legjobb történetek személyesek, őszinték és inspirálóak. Oszd meg a kihívásokat is, nem csak a szép pillanatokat!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}