
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Edit, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';

const eventTypeLabels = {
  'orokbefogado_nap': 'Örökbefogadó nap',
  'jotekonysagi_esemeny': 'Jótékonysági esemény',
  'oktato_program': 'Oktató program',
  'kozossegi_talalkozo': 'Közösségi találkozó'
};

export default function EventListItem({ event, onEdit, onDelete }) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <Badge variant={isUpcoming ? "default" : "secondary"}>
                {eventTypeLabels[event.event_type]}
              </Badge>
              {event.entry_fee > 0 && (
                <Badge variant="outline">{event.entry_fee} Ft</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(eventDate, 'yyyy. MMM dd. (EEEE)', { locale: hu })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{event.start_time} - {event.end_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            </div>

            {event.max_participants > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Users className="w-4 h-4" />
                <span>Max. {event.max_participants} fő</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {event.registration_required && (
                <Badge variant="outline" className="text-xs">Regisztráció kötelező</Badge>
              )}
              {event.entry_fee === 0 && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Ingyenes</Badge>
              )}
              {event.facebook_event && (
                <Badge variant="outline" className="text-xs">Facebook esemény</Badge>
              )}
            </div>

            {event.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
            )}
          </div>

          {event.photo_url && (
            <div className="ml-4 flex-shrink-0">
              <img 
                src={event.photo_url} 
                alt={event.title} 
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center gap-2">
            {event.event_website && (
              <Button size="sm" variant="ghost" asChild>
                <a href={event.event_website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
            <span className={`text-xs px-2 py-1 rounded ${
              isUpcoming 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isUpcoming ? 'Közelgő' : 'Lezárult'}
            </span>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(event)}>
              <Edit className="w-4 h-4 mr-1" />
              Szerkesztés
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(event)}>
              <Trash2 className="w-4 h-4 mr-1" />
              Törlés
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
