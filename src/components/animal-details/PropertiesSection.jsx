import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Smile, Dog, Home, ShieldPlus } from 'lucide-react';

export default function PropertiesSection({ animal }) {
  const properties = [
    { label: 'Oltott', value: animal.vaccinated, icon: <ShieldPlus /> },
    { label: 'Chippelt', value: animal.microchipped, icon: <ShieldPlus /> },
    { label: 'Ivartalanított', value: animal.sterilized, icon: <ShieldPlus /> },
    { label: 'Gyerekbarát', value: (animal.personality || []).includes('barátságos'), icon: <Smile /> },
    { label: 'Más kutyákkal', value: (animal.personality || []).includes('szociális'), icon: <Dog /> },
    { label: 'Lakásban tartható', value: animal.size === 'kicsi' || animal.size === 'kozepes', icon: <Home /> },
  ];

  return (
    <Card className="shadow-lg border-gray-100">
      <CardHeader>
        <CardTitle>Tulajdonságok</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {properties.map(prop => (
            <div key={prop.label} className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
              {prop.value ? 
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" /> : 
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              }
              <div>
                <p className="font-semibold">{prop.label}</p>
                <p className="text-sm text-gray-500">{prop.value ? 'Igen' : 'Nem/Ismeretlen'}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}