import React from 'react';
import { ShoppingBag, ArrowRight, Heart } from 'lucide-react';

const steps = [
  { icon: ShoppingBag, title: 'Válassz terméket', description: 'Böngéssz partnereink kínálatában, és találd meg a kedvencednek valót.' },
  { icon: ArrowRight, title: 'Vásárolj a partnernél', description: 'A „Megveszem” gomb átirányít partnerünk oldalára, ahol befejezheted a vásárlást.' },
  { icon: Heart, title: 'Támogasd a menhelyeket', description: 'Minden sikeres vásárlás után jutalékot kapunk, amit a menhelyek támogatására fordítunk.' }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Vásárlás, amivel jót teszel</h2>
          <p className="text-lg text-gray-600 mt-4">Hogyan működik a támogatás?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mx-auto mb-6">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}