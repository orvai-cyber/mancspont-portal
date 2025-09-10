
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, RotateCw, Search } from 'lucide-react';
import { hungarianCounties, budapestDistricts } from '@/components/shared/hungarian-locations';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn utility is correctly imported

const counties = Object.keys(hungarianCounties);

const serviceTagsByCategory = {
  panzio: ['Felügyelet', 'Sétáltatás', 'Etetés', 'Játék'],
  napköz: ['Csoportos játék', 'Tanítás', 'Pihenőidő', 'Kültéri programok'],
  iskola: ['Engedelmességi képzés', 'Agility', 'Szocializáció', 'Problémás viselkedés kezelése'],
  szitter: ['Otthoni felügyelet', 'Sétáltatás', 'Gyógyszer beadása', 'Napi riportok']
};

const AutocompleteCity = ({ county, value, onSelect, disabled }) => {
  const [open, setOpen] = React.useState(false);
  const cities = county && hungarianCounties[county] ? hungarianCounties[county] : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value ? value : "Válassz várost..."} {/* Display selected value or placeholder */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Város keresése..." />
          <CommandEmpty>Nincs ilyen város.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {cities.map((city) => (
              <CommandItem
                key={city}
                value={city}
                onSelect={(currentValue) => {
                  onSelect(currentValue === value ? "" : currentValue); // Toggle selection
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === city ? "opacity-100" : "opacity-0"
                  )}
                />
                {city}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};


export default function ServiceFilters({ filters, onFilterChange, onReset, resultsCount, activeCategory }) {
  // `useState` and `useEffect` for `cities` are removed as per the new derivation logic.
  // The 'cities' variable that was here is now handled within AutocompleteCity or the Budapest conditional logic.

  const handleServiceChange = (service, checked) => {
    const newServices = checked
      ? [...filters.services, service]
      : filters.services.filter(s => s !== service);
    onFilterChange({ ...filters, services: newServices });
  };
  
  const relevantServices = serviceTagsByCategory[activeCategory] || [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 space-y-6">
      <div className="flex items-center gap-3 text-xl font-bold">
        <SlidersHorizontal className="w-6 h-6 text-indigo-600" />
        Szűrő
      </div>
      <p className="text-sm text-gray-500">{resultsCount} szolgáltató</p>

      {/* Keresés */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Keresés</label>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
           <Input 
              placeholder="Szolgáltató neve..." 
              className="pl-10"
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
          />
        </div>
      </div>

      {/* Vármegye */}
      <div className="space-y-2">
        <Label htmlFor="county-filter">Vármegye</Label>
        <Select
          value={filters.county || 'all'}
          onValueChange={(value) => onFilterChange({ ...filters, county: value, location: '' })} // Reset location when county changes and ensure correct value
        >
          <SelectTrigger id="county-filter">
            <SelectValue placeholder="Összes vármegye" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Összes vármegye</SelectItem>
            {counties.map(county => <SelectItem key={county} value={county}>{county}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Város */}
      <div className="space-y-2">
        <Label htmlFor="city-filter">Város / Kerület</Label>
        {filters.county === 'Budapest' ? (
          <Select
            value={filters.location || ''}
            onValueChange={(value) => onFilterChange({ ...filters, location: value })}
          >
            <SelectTrigger id="district-filter">
              <SelectValue placeholder="Válassz kerületet..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Összes kerület</SelectItem>
              {budapestDistricts.map(district => <SelectItem key={district} value={district}>{district}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : (
          <AutocompleteCity
            county={filters.county}
            value={filters.location || ''}
            onSelect={(value) => onFilterChange({ ...filters, location: value || '' })}
            disabled={!filters.county || filters.county === 'all'}
          />
        )}
      </div>

      {/* Árszint */}
      <div className="space-y-2">
          <label className="text-sm font-medium">Árszint</label>
          <Select value={filters.priceLevel} onValueChange={(value) => onFilterChange({ ...filters, priceLevel: value })}>
              <SelectTrigger><SelectValue placeholder="Mindegy" /></SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">Mindegy</SelectItem>
                  <SelectItem value="budget">Pénztárcabarát ($)</SelectItem>
                  <SelectItem value="standard">Átlagos ($$)</SelectItem>
                  <SelectItem value="premium">Prémium ($$$)</SelectItem>
              </SelectContent>
          </Select>
      </div>

      {/* Értékelés */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Minimum értékelés</label>
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
              {filters.minRating === 0 ? 'Nincs' : `${filters.minRating}+`}
            </span>
        </div>
        <Slider
          min={0} max={5} step={1}
          value={[filters.minRating]}
          onValueChange={(value) => onFilterChange({ ...filters, minRating: value[0] })}
        />
      </div>

      {/* Szolgáltatások */}
      {relevantServices.length > 0 && (
        <div className="space-y-4 rounded-lg border p-4">
           <h4 className="font-semibold text-base -mt-7 bg-white px-2 w-fit">Szolgáltatások</h4>
           <div className="grid grid-cols-2 gap-x-4 gap-y-3">
             {relevantServices.map(service => (
               <div key={service} className="flex items-center space-x-2">
                 <Checkbox 
                   id={service} 
                   checked={filters.services.includes(service)}
                   onCheckedChange={(checked) => handleServiceChange(service, checked)}
                 />
                 <Label htmlFor={service} className="cursor-pointer text-sm">{service}</Label>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Gomb */}
      <Button onClick={onReset} variant="outline" className="w-full">
        <RotateCw className="w-4 h-4 mr-2" />
        Szűrők törlése
      </Button>
    </div>
  );
}
