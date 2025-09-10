import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, MessageSquare, Edit } from 'lucide-react';

const activities = [
  {
    icon: Heart,
    action: 'Kedvelte Nagy Péter bejegyzését',
    time: '2 órája',
    color: 'text-red-500'
  },
  {
    icon: Edit,
    action: 'Új bejegyzést írt: "Luna első hónapja"',
    time: '1 napja',
    color: 'text-blue-500'
  },
  {
    icon: MessageSquare,
    action: 'Hozzászólt Szabó Mária történetéhez',
    time: '2 napja',
    color: 'text-green-500'
  }
];

export default function ActivityFeed() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          Legutóbbi aktivitás
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <activity.icon className={`w-4 h-4 mt-0.5 ${activity.color}`} />
            <div>
              <p className="text-sm text-gray-800">{activity.action}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}