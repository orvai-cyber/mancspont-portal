
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, RotateCw, Search } from 'lucide-react';
import { hungarianCounties, budapestDistricts } from '@/components/shared/hungarian-locations';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';


const counties = Object.keys(hungarianCounties);

const personalityTags = [
    { id: 'baratsagos', label: 'Barátságos' },
    { id: 'jastekos', label: 'Játékos' },
    { id: 'nyugodt', label: 'Nyugodt' },
    { id: 'energikus', label: 'Energikus' },
    { id: 'szereto', label: 'Szerető' },
    { id: 'vedelmezo', label: 'Védelmező' },
    { id: 'fuggetlen', label: 'Független' },
    { id: 'szocialis', label: 'Szociális' },
];

const specialTags = [
    { id: 'urgent', label: 'Sürgős', className: 'text-red-600' },
    { id: 'special_needs', label: 'Speciális igényű', className: 'text-blue-600' },
];

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


export default function AnimalFilters({ filters, onFilterChange, onReset, resultsCount }) {
    const handleTagChange = (tagId, checked) => {
        const newTags = checked
          ? [...filters.tags, tagId]
          : filters.tags.filter(t => t !== tagId);
        onFilterChange({ tags: newTags });
    };

    return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h3 className="flex items-center gap-3 text-xl font-semibold leading-none tracking-tight">
          <SlidersHorizontal className="w-6 h-6 text-green-600" />
          Szűrő
        </h3>
        <p className="text-sm text-muted-foreground">{resultsCount} találat</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Keresés</label>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
           <Input
              placeholder="Név, fajta..."
              className="pl-10"
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="county-filter" className="text-sm font-medium">Vármegye</Label>
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
        <Label htmlFor="city-filter" className="text-sm font-medium">Város / Kerület</Label>
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

      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
              <label className="text-sm font-medium">Faj</label>
              <Select value={filters.species} onValueChange={(value) => onFilterChange({ species: value })}>
                  <SelectTrigger><SelectValue placeholder="Mindegy" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Mindegy</SelectItem>
                      <SelectItem value="kutya">Kutya</SelectItem>
                      <SelectItem value="macska">Macska</SelectItem>
                      <SelectItem value="nyul">Nyúl</SelectItem>
                      <SelectItem value="hazihigor">Házihörcsög</SelectItem>
                      <SelectItem value="madar">Madár</SelectItem>
                      <SelectItem value="egyeb">Egyéb</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="space-y-2">
              <label className="text-sm font-medium">Kor</label>
              <Select value={filters.age} onValueChange={(value) => onFilterChange({ age: value })}>
                  <SelectTrigger><SelectValue placeholder="Mindegy" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Mindegy</SelectItem>
                      <SelectItem value="kolyok">Kölyök</SelectItem>
                      <SelectItem value="felnott">Felnőtt</SelectItem>
                      <SelectItem value="idos">Idős</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="space-y-2">
              <label className="text-sm font-medium">Méret</label>
              <Select value={filters.size} onValueChange={(value) => onFilterChange({ size: value })}>
                  <SelectTrigger><SelectValue placeholder="Mindegy" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Mindegy</SelectItem>
                      <SelectItem value="kicsi">Kicsi</SelectItem>
                      <SelectItem value="kozepes">Közepes</SelectItem>
                      <SelectItem value="nagy">Nagy</SelectItem>
                      <SelectItem value="orias">Óriás</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="space-y-2">
              <label className="text-sm font-medium">Nem</label>
              <Select value={filters.gender} onValueChange={(value) => onFilterChange({ gender: value })}>
                  <SelectTrigger><SelectValue placeholder="Mindegy" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Mindegy</SelectItem>
                      <SelectItem value="him">Hím</SelectItem>
                      <SelectItem value="nosteny">Nőstény</SelectItem>
                  </SelectContent>
              </Select>
          </div>
      </div>
      <div className="space-y-4 rounded-lg border p-4">
           <h4 className="font-semibold text-base -mt-7 bg-white px-2 w-fit">Tulajdonságok</h4>
           <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {specialTags.map(tag => (
                    <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox id={tag.id} checked={filters.tags.includes(tag.id)} onCheckedChange={(checked) => handleTagChange(tag.id, checked)} />
                        <Label htmlFor={tag.id} className={`cursor-pointer font-medium ${tag.className}`}>{tag.label}</Label>
                    </div>
                ))}
                {personalityTags.map(tag => (
                    <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={tag.id}
                            checked={filters.tags.includes(tag.id)}
                            onCheckedChange={(checked) => handleTagChange(tag.id, checked)}
                        />
                        <Label htmlFor={tag.id} className="cursor-pointer">{tag.label}</Label>
                    </div>
                ))}
           </div>
      </div>
      <Button onClick={onReset} variant="outline" className="w-full">
        <RotateCw className="w-4 h-4 mr-2" />
        Szűrők törlése
      </Button>
    </div>
    );
}
