import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Heart, Star, Trophy } from 'lucide-react';

const achievements = [
  {
    icon: Heart,
    title: 'Első Szerelem',
    description: 'Első örökbefogadás',
    earned: true,
    color: 'text-red-500'
  },
  {
    icon: Star,
    title: 'Közösség Kedvence',
    description: '100+ kedvelés',
    earned: true,
    color: 'text-yellow-500'
  },
  {
    icon: Trophy,
    title: 'Történetmesélő',
    description: '10+ sikertörténet',
    earned: false,
    color: 'text-blue-500'
  }
];

export default function Achievements() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Kitüntetések
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement, index) => (
          <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${achievement.earned ? 'bg-yellow-50' : 'bg-gray-50'}`}>
            <achievement.icon className={`w-5 h-5 mt-0.5 ${achievement.earned ? achievement.color : 'text-gray-400'}`} />
            <div>
              <p className={`font-semibold text-sm ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                {achievement.title}
              </p>
              <p className="text-xs text-gray-500">{achievement.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}