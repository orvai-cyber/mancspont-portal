import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Award, ArrowRight } from 'lucide-react';

// Minta adatok, később lecserélhető valós adatokra
const supporters = [
  { name: "Anna K.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  { name: "Gergő V.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d" },
  { name: "Eszter F.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d" },
  { name: "Dávid S.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026707d" },
  { name: "Bence N.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026708d" },
];

export default function SupportersWall() {
  return (
    <Card className="shadow-lg border-gray-100">
      <CardHeader className="text-center">
        <div className="inline-block bg-orange-100 text-orange-600 p-3 rounded-full mx-auto mb-2">
            <Award className="w-6 h-6"/>
        </div>
        <CardTitle>Támogatóink</CardTitle>
        <CardDescription>Ők adják a reményt minden mancsnak!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6">
            {supporters.map((supporter, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={supporter.avatar} alt={supporter.name} />
                        <AvatarFallback>{supporter.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm text-gray-700">{supporter.name}</span>
                    <span className="ml-auto text-xs text-gray-500">nemrég támogatta</span>
                </div>
            ))}
        </div>
        <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700">
            Összes támogatónk
            <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}