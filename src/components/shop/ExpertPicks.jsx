import React from 'react';
import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExpertPicks({ products }) {
  if (products.length === 0) return null;

  const mainPick = products[0];
  const otherPicks = products.slice(1);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-purple-100 rounded-2xl mb-4">
            <Award className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Szakértőink ajánlásával</h2>
          <p className="text-lg text-gray-600 mt-4">Kollégáink által tesztelt és jóváhagyott termékek.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Main Pick */}
          <a href={mainPick.affiliate_url} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src={mainPick.photos[0]} alt={mainPick.name} className="w-full h-96 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-3xl font-bold text-white mb-2">{mainPick.name}</h3>
                <p className="text-white/80 line-clamp-2 mb-4">{`"${mainPick.expert_review}"`}</p>
                <Button variant="secondary">Megnézem</Button>
              </div>
            </div>
          </a>
          {/* Other Picks */}
          <div className="space-y-6">
            {otherPicks.map(product => (
              <a href={product.affiliate_url} key={product.id} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <img src={product.photos[0]} alt={product.name} className="w-24 h-24 object-cover rounded-xl" />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">{product.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-1 mt-1">{`"${product.expert_review}"`}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}