import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, Users, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EventDescription({ event }) {
  return (
    <div className="space-y-6">
      {/* Event Description */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileText className="w-6 h-6 text-blue-600" />
            Esemény leírása
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed">
            {event.description || "Részletes leírás hamarosan..."}
          </p>
        </CardContent>
      </Card>

      {/* Event Program/Schedule */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Clock className="w-6 h-6 text-green-600" />
            Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock schedule - in real app, this would come from event data */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-bold text-gray-600 min-w-[80px]">09:00</div>
              <div>
                <div className="font-semibold">Megnyitó és regisztráció</div>
                <div className="text-gray-600 text-sm">Üdvözlés és információk az eseményről</div>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-bold text-gray-600 min-w-[80px]">10:00</div>
              <div>
                <div className="font-semibold">Állatbemutatók</div>
                <div className="text-gray-600 text-sm">Megismerkedés az örökbefogadható állatokkal</div>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-bold text-gray-600 min-w-[80px]">14:00</div>
              <div>
                <div className="font-semibold">Örökbefogadási tanácsadás</div>
                <div className="text-gray-600 text-sm">Szakértői segítség a megfelelő társ megtalálásához</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Info className="w-6 h-6 text-orange-600" />
            Fontos információk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Belépő:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Ingyenes</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Regisztráció:</span>
              <Badge variant={event.registration_required ? "default" : "secondary"}>
                {event.registration_required ? "Kötelező" : "Nem szükséges"}
              </Badge>
            </div>
            {event.max_participants && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Max. résztvevő:</span>
                <Badge variant="outline">{event.max_participants} fő</Badge>
              </div>
            )}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Parkolás:</span>
              <Badge variant="secondary">Ingyenes</Badge>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <p className="text-yellow-800 font-medium mb-2">📋 Mit hozz magaddal:</p>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Személyazonosító okmány (örökbefogadáshoz)</li>
              <li>• Kényelmes ruházat és cipő</li>
              <li>• Jó hangulat és nyitott szív 💝</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}