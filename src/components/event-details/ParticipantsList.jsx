import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockParticipants = [
  { name: "Kovács Anna", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=KA" },
  { name: "Nagy Péter", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=NP" },
  { name: "Szabó Mária", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=SM" },
  { name: "Tóth László", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=TL" },
  { name: "Kiss Éva", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=KE" },
  { name: "Horváth Gábor", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=HG" },
];

export default function ParticipantsList({ event }) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          Résztvevők ({mockParticipants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockParticipants.slice(0, 5).map((participant, index) => (
            <div key={index} className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="font-medium text-gray-900">{participant.name}</p>
                <p className="text-xs text-gray-500">Állatkedvelő</p>
              </div>
            </div>
          ))}
          
          {mockParticipants.length > 5 && (
            <Button variant="ghost" className="w-full mt-3">
              <MoreHorizontal className="w-4 h-4 mr-2" />
              +{mockParticipants.length - 5} további résztvevő
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}