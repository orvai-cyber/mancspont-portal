
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, RotateCcw, Search, MapPin } from 'lucide-react';
import { hungarianCounties } from '@/components/shared/hungarian-locations';
import { Label } from '@/components/ui/label';

const counties = Object.keys(hungarianCounties);

export default function ShelterFilters({ filters, onFilterChange, onReset, resultsCount }) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync localFilters with filters prop
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field, value) => {
    let newFilters = { ...localFilters, [field]: value };
    // Reset location when county changes to ensure consistency
    if (field === 'county') {
      newFilters.location = '';
    }
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetAllFilters = () => {
    const defaultFilters = {
      searchTerm: "",
      location: "", // Reset to empty string for the new input field
      county: "all",
      capacity: "all",
      foundation: "all",
      sortBy: "name",
    };
    setLocalFilters(defaultFilters);
    onReset(defaultFilters);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-2xl border space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-orange-600" />
          Szűrők
        </h3>
        <Button variant="ghost" size="sm" onClick={resetAllFilters} className="text-sm">
          <RotateCcw className="w-3 h-3 mr-1" />
          Törlés
        </Button>
      </div>

      {/* Removed resultsCount paragraph as per outline's implicit design */}

      {/* Keresés */}
      <div className="space-y-2">
        <Label htmlFor="search">Keresés</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Név, leírás..."
            value={localFilters.searchTerm}
            onChange={(e) => handleInputChange('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Helyszín szűrő */}
      <div className="space-y-2">
        <Label>Helyszín</Label>
        <div className="space-y-2">
          <Select value={localFilters.county} onValueChange={(value) => handleInputChange('county', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Vármegye" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Összes vármegye</SelectItem>
              {counties.map(county => (
                <SelectItem key={county} value={county}>{county}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <Input
                id="location"
                placeholder="Város, kerület..."
                value={localFilters.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="pl-10"
             />
          </div>
        </div>
      </div>

      {/* Kapacitás */}
      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="capacity-filter" className="text-sm font-medium">Kapacitás</Label>
              <Select value={localFilters.capacity} onValueChange={(value) => handleInputChange('capacity', value)}>
                  <SelectTrigger id="capacity-filter">
                      <SelectValue placeholder="Mindegy" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Mindegy</SelectItem>
                      <SelectItem value="small">Kicsi (&lt;50)</SelectItem>
                      <SelectItem value="medium">Közepes (50-100)</SelectItem>
                      <SelectItem value="large">Nagy (&gt;100)</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="space-y-2">
              <Label htmlFor="foundation-filter" className="text-sm font-medium">Alapítás</Label>
              <Select value={localFilters.foundation} onValueChange={(value) => handleInputChange('foundation', value)}>
                  <SelectTrigger id="foundation-filter">
                      <SelectValue placeholder="Mindegy" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Mindegy</SelectItem>
                      <SelectItem value="new">Új (2015-től)</SelectItem>
                      <SelectItem value="established">Régi</SelectItem>
                  </SelectContent>
              </Select>
          </div>
      </div>

      {/* Rendezés */}
      <div className="space-y-2">
          <Label htmlFor="sort-filter" className="text-sm font-medium">Rendezés</Label>
          <Select value={localFilters.sortBy} onValueChange={(value) => handleInputChange('sortBy', value)}>
              <SelectTrigger id="sort-filter">
                  <SelectValue placeholder="Rendezés" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="name">Név szerint</SelectItem>
                  <SelectItem value="capacity">Kapacitás szerint</SelectItem>
                  <SelectItem value="animals_helped">Segített állatok szerint</SelectItem>
                  <SelectItem value="foundation">Alapítási év szerint</SelectItem>
              </SelectContent>
          </Select>
      </div>
      {/* The previous reset button at the bottom is removed, as it's now in the header */}
    </div>
  );
}
