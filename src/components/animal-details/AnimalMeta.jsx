import React from 'react';
import { PawPrint, Scale, Calendar, Zap } from 'lucide-react';

const translations = {
  'kolyok': 'kölyök',
  'felnott': 'felnőtt',
  'idos': 'idős',
  'him': 'hím',
  'nosteny': 'nőstény',
  'kozepes': 'közepes',
  'oriasi': 'óriás',
};

const translate = (value) => translations[value] || value;


export default function AnimalMeta({ animal }) {
  const metaItems = [
    { icon: <PawPrint className="w-5 h-5"/>, label: "Faj", value: animal.breed },
    { icon: <Scale className="w-5 h-5"/>, label: "Méret", value: translate(animal.size) },
    { icon: <Calendar className="w-5 h-5"/>, label: "Kor", value: translate(animal.age) },
    { icon: <Zap className="w-5 h-5"/>, label: "Nem", value: translate(animal.gender) },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-gray-50 rounded-xl border">
      {metaItems.map(item => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
            {item.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="font-semibold capitalize">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}