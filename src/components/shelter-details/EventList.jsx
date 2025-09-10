import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { format } from "date-fns";
import { hu } from "date-fns/locale";

export default function EventList({ events }) {
  return (
    <Card className="shadow-lg border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600"/>
            Közelgő eseményeink
        </CardTitle>
        <Link to={createPageUrl(`Events?shelter=${events[0]?.organizer}`)}>
          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
            Összes <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length > 0 ? (
            events.map(event => (
                <div key={event.id} className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors">
                    <div className="text-center w-16 flex-shrink-0">
                        <div className="text-2xl font-bold text-orange-600">{format(new Date(event.date), 'dd')}</div>
                        <div className="text-sm font-semibold capitalize">{format(new Date(event.date), 'MMM', { locale: hu })}</div>
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-bold text-gray-800">{event.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                    <Link to={createPageUrl(`EventDetails?id=${event.id}`)}>
                        <Button variant="outline" size="sm">Részletek</Button>
                    </Link>
                </div>
            ))
        ) : (
            <div className="text-center py-10">
                <p className="text-gray-600">Jelenleg nincsenek meghirdetett események.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}