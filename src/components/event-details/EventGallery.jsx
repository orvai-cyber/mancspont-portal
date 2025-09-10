import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Images, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockGalleryImages = [
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=1000",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000", 
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000",
  "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000",
  "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000",
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=1000",
];

export default function EventGallery({ event }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="space-y-6">
      {/* Event Banner */}
      {event.photo_url && (
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Images className="w-5 h-5 text-purple-600" />
              Esemény borító
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <img 
              src={event.photo_url} 
              alt={event.title}
              className="w-full h-64 object-cover"
            />
          </CardContent>
        </Card>
      )}

      {/* Photo Gallery */}
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Images className="w-5 h-5 text-indigo-600" />
            Fotógaléria
          </CardTitle>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Teljes galéria
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mockGalleryImages.map((image, index) => (
              <div 
                key={index}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image} 
                  alt={`Esemény fotó ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="ghost" className="text-indigo-600">
              További fotók betöltése...
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* External Links */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>További információk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between">
            Esemény weboldala
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            Facebook esemény
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            Jegyvásárlás
            <ExternalLink className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}