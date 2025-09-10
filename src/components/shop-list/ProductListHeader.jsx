import React from 'react';
import { ChevronRight, ChevronsRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const categoryLabels = {
    all: "Minden termék", eleseg: "Eleség", felszereles: "Felszerelés", jatek: "Játék",
    apolas: "Ápolás", jutalomfalat: "Jutalomfalat", egyeb: "Egyéb"
};

const speciesLabels = { all: "", kutya: "Kutya", macska: "Macska", kisallat: "Kisállat" };

const sortOptions = [
    { value: 'popularity_score', label: 'Népszerűség' },
    { value: 'newest', label: 'Legújabb elöl' },
    { value: 'price_asc', label: 'Ár (növekvő)' },
    { value: 'price_desc', label: 'Ár (csökkenő)' },
    { value: 'rating', label: 'Értékelés szerint' }
];

export default function ProductListHeader({ category, species, resultsCount, sortBy, onSortChange }) {
  const title = `${categoryLabels[category] || 'Termékek'} ${speciesLabels[species] || ''}`.trim();

  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link to={createPageUrl("Shop")} className="hover:text-green-600">Shop</Link>
          {species !== 'all' && (
            <>
              <ChevronRight className="w-4 h-4 mx-1" />
              <Link to={createPageUrl(`ShopList?species=${species}`)} className="hover:text-green-600 capitalize">{speciesLabels[species]}</Link>
            </>
          )}
          {category !== 'all' && (
            <>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-700 capitalize">{categoryLabels[category]}</span>
            </>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-0">{title}</h1>
            <div className="flex items-center gap-4">
                <p className="text-gray-600"><span className="font-bold text-green-600">{resultsCount}</span> termék</p>
                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Rendezés..." />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>
    </section>
  );
}