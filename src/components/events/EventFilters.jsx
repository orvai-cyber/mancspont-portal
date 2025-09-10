import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, RotateCw, Search } from 'lucide-react';
import { hungarianCounties, budapestDistricts } from '@/components/shared/hungarian-locations';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const counties = Object.keys(hungarianCounties);

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
          {value || "Válassz várost..."}
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
                  onSelect(currentValue === value ? "" : currentValue);
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


export default function EventFilters({ filters, onFilterChange, onReset, resultsCount }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search-input" className="text-sm font-medium">Keresés</Label>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
           <Input 
              id="search-input"
              placeholder="Esemény, szervező..." 
              className="pl-10"
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
          />
        </div>
      </div>

      {/* Helyszín */}
      <div className="space-y-2">
        <Label htmlFor="county-filter">Vármegye</Label>
        <Select
          value={filters.county || 'all'}
          onValueChange={(value) => onFilterChange({ county: value, location: 'all' })}
        >
          <SelectTrigger id="county-filter">
            <SelectValue placeholder="Összes vármegye" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Összes vármegye</SelectItem>
            {counties.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city-filter">Város / Kerület</Label>
        {filters.county === 'Budapest' ? (
          <Select
            value={filters.location || 'all'}
            onValueChange={(value) => onFilterChange({ location: value })}
          >
            <SelectTrigger id="district-filter">
              <SelectValue placeholder="Válassz kerületet..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Összes kerület</SelectItem>
              {budapestDistricts.map(district => <SelectItem key={district} value={district}>{district}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : (
          <AutocompleteCity
            county={filters.county}
            value={filters.location === 'all' ? '' : filters.location}
            onSelect={(value) => onFilterChange({ location: value || 'all' })}
            disabled={!filters.county || filters.county === 'all'}
          />
        )}
      </div>

      {/* Dátum és Típus */}
      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="date-range-filter" className="text-sm font-medium">Időpont</Label>
              <Select value={filters.dateRange} onValueChange={(value) => onFilterChange({ dateRange: value })}>
                  <SelectTrigger id="date-range-filter"><SelectValue placeholder="Mindegy" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Mindegy</SelectItem>
                      <SelectItem value="today">Mai</SelectItem>
                      <SelectItem value="this_week">Ezen a héten</SelectItem>
                      <SelectItem value="this_weekend">Hétvégén</SelectItem>
                      <SelectItem value="upcoming">Közelgő</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="space-y-2">
              <Label htmlFor="event-type-filter" className="text-sm font-medium">Típus</Label>
              <Select value={filters.eventType} onValueChange={(value) => onFilterChange({ eventType: value })}>
                  <SelectTrigger id="event-type-filter"><SelectValue placeholder="Mindegy" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Mindegy</SelectItem>
                      <SelectItem value="orokbefogado_nap">Örökbefogadó nap</SelectItem>
                      <SelectItem value="jotekonysagi_esemeny">Jótékonysági</SelectItem>
                      <SelectItem value="oktato_program">Oktató</SelectItem>
                      <SelectItem value="kozossegi_talalkozo">Közösségi</SelectItem>
                  </SelectContent>
              </Select>
          </div>
      </div>

      {/* Gomb */}
      <Button onClick={onReset} variant="outline" className="w-full">
        <RotateCw className="w-4 h-4 mr-2" />
        Szűrők törlése
      </Button>
    </div>
  );
}