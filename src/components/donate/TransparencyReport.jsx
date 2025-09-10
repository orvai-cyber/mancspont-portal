import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Orvosi ellátás', value: 40 },
  { name: 'Élelem', value: 30 },
  { name: 'Menhely fenntartás', value: 20 },
  { name: 'Adminisztráció', value: 10 },
];
const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa'];

export default function TransparencyReport() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gray-900 text-white rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Teljes átláthatóság</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">Hiszünk abban, hogy tudnod kell, hová kerül a pénzed. Minden adományt gondosan kezelünk, hogy a lehető legnagyobb hatást érjük el vele. Nézd meg, hogyan oszlik meg a támogatásod!</p>
              <ul className="space-y-3">
                {data.map((entry, index) => (
                  <li key={`item-${index}`} className="flex items-center text-lg">
                    <div style={{backgroundColor: COLORS[index % COLORS.length]}} className="w-4 h-4 rounded-full mr-3"></div>
                    <span>{entry.name}: <span className="font-bold">{entry.value}%</span></span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: 'none',
                        borderRadius: '10px'
                     }}
                     formatter={(value) => [`${value}%`, 'Arány']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}