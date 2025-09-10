import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Phone, Mail, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function OrganizerCard({ event }) {
  return (
    <Card className="shadow-lg border-0 sticky top-24">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl">Szervező</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.organizer}</h3>
          <p className="text-gray-600">Állatmenhely és Alapítvány</p>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>+36 1 234 5678</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>info@{event.organizer.toLowerCase().replace(/\s+/g, '')}.hu</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>www.{event.organizer.toLowerCase().replace(/\s+/g, '')}.hu</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">150+</div>
              <div className="text-xs text-gray-500">mentett állat</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-xs text-gray-500">sikeres örökbefogadás</div>
            </div>
          </div>
        </div>

        <Link to={createPageUrl(`Shelters`)}>
          <Button variant="outline" className="w-full">
            Menhely profil
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}