import React from 'react';
import { CheckCircle, FileText, Handshake, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    icon: FileText,
    title: 'Jelentkezés',
    description: 'Töltsd ki az örökbefogadási kérelmet'
  },
  {
    icon: CheckCircle,
    title: 'Visszaigazolás',
    description: 'A menhely felviszi veled a kapcsolatot'
  },
  {
    icon: Handshake,
    title: 'Szerződés',
    description: 'Személyes találkozó és szerződéskötés'
  },
  {
    icon: Home,
    title: 'Hazaköltözés',
    description: 'Az új családtag hazaköltözik'
  }
];

export default function AdoptionProcess() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-gray-800">
          Az örökbefogadás menete
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <step.icon className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                {step.title}
              </h4>
              <p className="text-xs text-gray-600 hidden sm:block">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}