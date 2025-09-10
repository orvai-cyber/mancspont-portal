import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Calendar, PawPrint, MapPin, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';

export default function ShelterListItem({ shelter }) {
  return (
    <Card className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-grow space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-gray-900">{shelter.name}</h3>
            <Badge variant="secondary">
              <PawPrint className="w-3 h-3 mr-1" />
              {shelter.animalCount} állat
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Csatlakozott: {format(new Date(shelter.created_date), 'yyyy. MM. dd.', { locale: hu })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{shelter.county}, {shelter.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{shelter.phone}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
          <Link to={createPageUrl(`AdminEditShelter?id=${shelter.id}`)}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Szerkesztés
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}