import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';

const petOptions = [
  { value: 'all', label: 'Minden állat' },
  { value: 'kutya', label: 'Kutya' },
  { value: 'macska', label: 'Macska' },
  { value: 'kisallat', label: 'Kisállat' }
];

const categoryOptions = [
  { value: 'all', label: 'Minden kategória' },
  { value: 'eleseg', label: 'Eleség' },
  { value: 'felszereles', label: 'Felszerelés' },
  { value: 'jatek', label: 'Játék' },
  { value: 'apolas', label: 'Ápolás' },
  { value: 'jutalomfalat', label: 'Jutalomfalat' }
];

export default function ProductFilters({ filters, onFilterChange, uniqueBrands, maxPrice, isLoading }) {
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const visibleBrands = showAllBrands ? uniqueBrands : uniqueBrands.slice(0, 5);

  useEffect(() => {
    setLocalPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  const handleBrandChange = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };
  
  const resetFilters = () => {
    onFilterChange({
      searchTerm: '',
      category: 'all',
      species: 'all',
      brands: [],
      priceRange: [0, maxPrice || 50000],
      onlyOnSale: false,
      minRating: 0,
    });
  };
  
  if (isLoading) {
      return (
          <Card className="shadow-lg border-gray-200/80">
              <CardHeader className="border-b"><Skeleton className="h-6 w-2/3" /></CardHeader>
              <CardContent className="p-6 space-y-6">
                  {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </CardContent>
          </Card>
      )
  }

  return (
    <Card className="shadow-lg border-gray-200/80">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Szűrés</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Keress termékre, márkára..." 
            className="pl-10"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Állat fajtája</Label>
          <Select value={filters.species} onValueChange={(value) => onFilterChange({ ...filters, species: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{petOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Kategória</Label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange({ ...filters, category: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{categoryOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
            <Label>Márka</Label>
            <div className="space-y-2">
                {visibleBrands.map(brand => (
                    <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={`brand-${brand}`} checked={filters.brands.includes(brand)} onCheckedChange={() => handleBrandChange(brand)} />
                        <label htmlFor={`brand-${brand}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{brand}</label>
                    </div>
                ))}
            </div>
            {uniqueBrands.length > 5 && (
                <Button variant="link" size="sm" onClick={() => setShowAllBrands(!showAllBrands)} className="p-0 h-auto">
                    {showAllBrands ? 'Kevesebb mutatása' : `+${uniqueBrands.length - 5} további`}
                </Button>
            )}
        </div>

        <div className="space-y-3">
          <Label>Ár</Label>
          <Slider
            min={0}
            max={maxPrice || 50000}
            step={100}
            value={localPriceRange}
            onValueChange={setLocalPriceRange}
            onValueCommit={(value) => onFilterChange({ ...filters, priceRange: value })}
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{localPriceRange[0]} Ft</span>
            <span>{localPriceRange[1]} Ft</span>
          </div>
        </div>

        <div className="space-y-3">
            <Label>Értékelés</Label>
            <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        className={`cursor-pointer ${filters.minRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        onClick={() => onFilterChange({ ...filters, minRating: filters.minRating === star ? 0 : star })}
                    />
                ))}
            </div>
        </div>
        
        <div className="flex items-center space-x-2 pt-4 border-t">
          <Checkbox id="on-sale" checked={filters.onlyOnSale} onCheckedChange={(checked) => onFilterChange({ ...filters, onlyOnSale: checked })} />
          <label htmlFor="on-sale" className="text-sm font-medium leading-none">Csak akciós termékek</label>
        </div>

        <Button onClick={resetFilters} variant="ghost" className="w-full text-gray-600">
          <RotateCcw className="w-4 h-4 mr-2" />
          Szűrők törlése
        </Button>
      </CardContent>
    </Card>
  );
}