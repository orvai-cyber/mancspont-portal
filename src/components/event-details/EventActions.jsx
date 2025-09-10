import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Share2, Bookmark, Users, Check, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/api/entities';
import { EventRegistration } from '@/api/entities';

export default function EventActions({ event }) {
  const [isAttending, setIsAttending] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAttendance = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        
        // Ellenőrizzük, hogy már jelentkezett-e
        const registrations = await EventRegistration.filter({
          event_id: event.id,
          user_id: user.id,
          status: 'active'
        });
        
        setIsAttending(registrations.length > 0);
      } catch (error) {
        console.error('Hiba a részvétel ellenőrzésekor:', error);
      }
    };
    
    if (event?.id) {
      checkAttendance();
    }
  }, [event]);

  const handleAttendance = async () => {
    if (!currentUser) {
      // Ha nincs bejelentkezve, irányítsuk a bejelentkezéshez
      User.login();
      return;
    }

    setIsLoading(true);
    try {
      if (isAttending) {
        // Részvétel visszavonása
        const registrations = await EventRegistration.filter({
          event_id: event.id,
          user_id: currentUser.id,
          status: 'active'
        });
        
        for (const registration of registrations) {
          await EventRegistration.update(registration.id, { status: 'cancelled' });
        }
        setIsAttending(false);
      } else {
        // Jelentkezés az eseményre
        await EventRegistration.create({
          event_id: event.id,
          user_id: currentUser.id,
          user_name: currentUser.full_name,
          user_email: currentUser.email,
          event_title: event.title,
          event_date: event.date,
          registration_date: new Date().toISOString()
        });
        setIsAttending(true);
      }
    } catch (error) {
      console.error('Hiba a részvétel kezelésekor:', error);
      alert('Hiba történt. Kérlek, próbáld újra!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In real app, this would save to user's favorites
  };

  const addToCalendar = () => {
    // Generate calendar link
    const startDate = new Date(event.date + 'T' + event.start_time);
    const endDate = new Date(event.date + 'T' + event.end_time);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Csatlakozz hozzám ezen az eseményen: ${event.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // In real app, show toast notification
        alert('Link másolva a vágólapra!');
      } catch (error) {
        console.log('Clipboard failed:', error);
      }
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Számíthatunk rád?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          size="lg" 
          className={`w-full ${isAttending ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={handleAttendance}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Mentés...
            </>
          ) : isAttending ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Részvétel visszavonása
            </>
          ) : (
            <>
              <Users className="w-5 h-5 mr-2" />
              Ott leszek
            </>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={addToCalendar}>
            <Calendar className="w-4 h-4 mr-2" />
            Naptárba
          </Button>
          <Button variant="outline" onClick={shareEvent}>
            <Share2 className="w-4 h-4 mr-2" />
            Megosztás
          </Button>
        </div>

        <Button 
          variant="ghost" 
          className={`w-full ${isSaved ? 'text-orange-600' : 'text-gray-600'}`}
          onClick={handleSave}
        >
          <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Elmentve' : 'Mentés később'}
        </Button>

        {/* Mock attendance count */}
        <div className="pt-4 border-t text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">42</div>
          <div className="text-sm text-gray-500">résztvevő jelentkezett</div>
        </div>

        {/* Event Status */}
        <div className="flex justify-center">
          <Badge className="bg-green-100 text-green-800">
            Még 8 hely van
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}