
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Upload,
  X,
  Plus,
  CheckCircle,
  AlertCircle,
  Building,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';
import { hungarianCounties, budapestDistricts } from '@/components/shared/hungarian-locations';
import { UploadFile } from '@/api/integrations';

const defaultFormState = {
  name: '',
  description: '',
  county: '',
  location: '',
  street_address: '',
  phone: '',
  email: '',
  website: '',
  facebook: '',
  instagram: '',
  barion_payment_link: '',
  opening_hours: '',
  logo_url: '',
  banner_url: '',
  photos: [],
  capacity: '',
  foundation_year: '',
  animals_helped: 0,
  donation_goal: '',
  verified: false,
  verification_requested: false,
  is_featured: false,
  company_name: '',
  tax_number: '',
  bank_account: '',
  postal_code: '',
  contact_person_name: '',
  contact_person_phone: '',
  contact_person_email: '',
};

export default function ShelterForm({ shelter, onSubmit, submitLabel = "Mentés", isLoading = false }) {
  const [formData, setFormData] = useState(defaultFormState);
  const [uploading, setUploading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // City autocomplete states
  const [citySearch, setCitySearch] = useState('');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // This effect will ONLY run when the shelter prop (specifically its ID) changes.
  // This correctly populates the form when the parent component loads the shelter data.
  useEffect(() => {
    if (shelter && shelter.id) {
      // Create a clean object from shelter data to avoid reference issues
      const initialData = { ...defaultFormState };
      for (const key in defaultFormState) {
        if (shelter[key] !== undefined && shelter[key] !== null) {
          initialData[key] = shelter[key];
        }
      }

      // Ensure specific fields are correctly formatted for the form
      initialData.photos = Array.isArray(shelter.photos) ? shelter.photos : [];
      initialData.capacity = shelter.capacity ? String(shelter.capacity) : '';
      initialData.foundation_year = shelter.foundation_year ? String(shelter.foundation_year) : '';
      initialData.donation_goal = shelter.donation_goal ? String(shelter.donation_goal) : '';
      initialData.animals_helped = shelter.animals_helped || 0;

      setFormData(initialData);
      // Also update the search input for the city
      if (shelter.location) {
        setCitySearch(shelter.location);
      }
    } else {
      // If no shelter or no id, reset to default state
      setFormData(defaultFormState);
      setCitySearch('');
    }
  }, [shelter?.id, shelter]); // Depend on the shelter object and its ID

  // Get available locations based on selected county
  const getAvailableLocations = () => {
    if (!formData.county) return [];
    
    if (formData.county === 'Budapest') {
      return budapestDistricts;
    } else {
      return hungarianCounties[formData.county] || [];
    }
  };

  const availableLocations = getAvailableLocations();
  
  // Filter locations based on search input
  const filteredLocations = availableLocations.filter(location =>
    location.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset location when county changes
      if (field === 'county') {
        newData.location = '';
        setCitySearch('');
      }
      
      return newData;
    });
  };

  const handleCitySelect = (selectedCity) => {
    handleInputChange('location', selectedCity);
    setCitySearch(selectedCity);
    setCityDropdownOpen(false);
  };

  const handlePhotoUpload = async (file, type) => {
    if (!file) return;

    setUploading(true);
    try {
      const result = await UploadFile({ file });
      
      if (type === 'photos') {
        setFormData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), result.file_url]
        }));
      } else {
        setFormData(prev => ({ ...prev, [type]: result.file_url }));
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: (prev.photos || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string numbers back to numbers
    const submitData = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      foundation_year: formData.foundation_year ? parseInt(formData.foundation_year) : null,
      donation_goal: formData.donation_goal ? parseInt(formData.donation_goal) : null,
    };
    
    console.log('Submitting data:', submitData); // Debug
    onSubmit(submitData);
  };

  const currentYear = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i), [currentYear]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alapadatok */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Alapadatok
          </CardTitle>
          <CardDescription>
            A menhely alapvető információi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Menhely neve *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="pl. Állatmentő Alapítvány"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Bemutatkozás *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Rövid bemutatkozás a menhelyről..."
              rows={4}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Helyszín adatok */}
      <Card>
        <CardHeader>
          <CardTitle>Helyszín adatok</CardTitle>
          <CardDescription>
            A menhely pontos címe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="county">Vármegye *</Label>
            <Select value={formData.county} onValueChange={(value) => handleInputChange('county', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Válassz vármegyét" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(hungarianCounties).map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">
              {formData.county === 'Budapest' ? 'Kerület *' : 'Település *'}
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                value={citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  setCityDropdownOpen(true);
                }}
                onFocus={() => setCityDropdownOpen(true)}
                placeholder={
                  formData.county === 'Budapest' 
                    ? 'Keresés a kerületek között...' 
                    : 'Keresés a települések között...'
                }
                className="pl-10"
                disabled={!formData.county}
                required
              />
              
              {cityDropdownOpen && filteredLocations.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredLocations.slice(0, 10).map((location) => (
                    <button
                      key={location}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      onClick={() => handleCitySelect(location)}
                    >
                      {location}
                    </button>
                  ))}
                  {filteredLocations.length > 10 && (
                    <div className="px-3 py-2 text-sm text-gray-500 border-t">
                      És még {filteredLocations.length - 10} település...
                    </div>
                  )}
                </div>
              )}
              
              {cityDropdownOpen && filteredLocations.length === 0 && citySearch && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 text-gray-500 text-sm">
                  {formData.county === 'Budapest' 
                    ? 'Nem található ilyen kerület' 
                    : 'Nem található ilyen település'
                  }
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="street_address">Utca és házszám</Label>
            <Input
              id="street_address"
              value={formData.street_address}
              onChange={(e) => handleInputChange('street_address', e.target.value)}
              placeholder="pl. Kossuth Lajos utca 12."
            />
          </div>

          <div>
            <Label htmlFor="postal_code">Irányítószám</Label>
            <Input
              id="postal_code"
              value={formData.postal_code}
              onChange={(e) => handleInputChange('postal_code', e.target.value)}
              placeholder="pl. 1234"
            />
          </div>
        </CardContent>
      </Card>

      {/* Kapcsolat */}
      <Card>
        <CardHeader>
          <CardTitle>Kapcsolat</CardTitle>
          <CardDescription>
            Elérhetőségek és kommunikációs csatornák
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+36 30 123 4567"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email cím *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="info@menhely.hu"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Weboldal</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://www.menhely.hu"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                placeholder="facebook.com/menhely"
              />
            </div>

            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="@menhely"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* További adatok */}
      <Card>
        <CardHeader>
          <CardTitle>További adatok</CardTitle>
          <CardDescription>
            Kiegészítő információk a menhelyről
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="capacity">Befogadóképesség</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="50"
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="foundation_year">Alapítás éve</Label>
              <Select value={formData.foundation_year} onValueChange={(value) => handleInputChange('foundation_year', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Válassz évet" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="animals_helped">Eddig segített állatok</Label>
              <Input
                id="animals_helped"
                type="number"
                value={formData.animals_helped}
                onChange={(e) => handleInputChange('animals_helped', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="opening_hours">Nyitvatartás</Label>
            <Input
              id="opening_hours"
              value={formData.opening_hours}
              onChange={(e) => handleInputChange('opening_hours', e.target.value)}
              placeholder="Hétfő-Péntek: 9:00-17:00, Hétvégén: 10:00-16:00"
            />
          </div>

          <div>
            <Label htmlFor="donation_goal">Havi adományozási cél (Ft)</Label>
            <Input
              id="donation_goal"
              type="number"
              value={formData.donation_goal}
              onChange={(e) => handleInputChange('donation_goal', e.target.value)}
              placeholder="100000"
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="barion_payment_link">Barion fizetési link</Label>
            <Input
              id="barion_payment_link"
              type="url"
              value={formData.barion_payment_link}
              onChange={(e) => handleInputChange('barion_payment_link', e.target.value)}
              placeholder="https://secure.barion.com/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Képek */}
      <Card>
        <CardHeader>
          <CardTitle>Képek</CardTitle>
          <CardDescription>
            Logo, banner és galéria képek
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Logo</Label>
              <div className="mt-2">
                {formData.logo_url ? (
                  <div className="relative">
                    <img
                      src={formData.logo_url}
                      alt="Logo előnézet"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => handleInputChange('logo_url', '')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e.target.files[0], 'logo_url')}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">Logo feltöltése</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Banner kép</Label>
              <div className="mt-2">
                {formData.banner_url ? (
                  <div className="relative">
                    <img
                      src={formData.banner_url}
                      alt="Banner előnézet"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => handleInputChange('banner_url', '')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e.target.files[0], 'banner_url')}
                      className="hidden"
                      id="banner-upload"
                    />
                    <label htmlFor="banner-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">Banner feltöltése</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label>Galéria képek</Label>
            <div className="mt-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(formData.photos || []).map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Galéria ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e.target.files[0], 'photos')}
                    className="hidden"
                    id="photos-upload"
                  />
                  <label htmlFor="photos-upload" className="cursor-pointer">
                    <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Új kép</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speciális beállítások */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Speciális beállítások
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAdvanced ? 'Elrejt' : 'Megjelenít'}
            </Button>
          </CardTitle>
        </CardHeader>
        {showAdvanced && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Cégnév/Alapítvány név</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="Állatmentő Alapítvány Kft."
                />
              </div>

              <div>
                <Label htmlFor="tax_number">Adószám</Label>
                <Input
                  id="tax_number"
                  value={formData.tax_number}
                  onChange={(e) => handleInputChange('tax_number', e.target.value)}
                  placeholder="12345678-1-23"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bank_account">Bankszámlaszám</Label>
              <Input
                id="bank_account"
                value={formData.bank_account}
                onChange={(e) => handleInputChange('bank_account', e.target.value)}
                placeholder="12345678-12345678-12345678"
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="contact_person_name">Kapcsolattartó neve</Label>
              <Input
                id="contact_person_name"
                value={formData.contact_person_name}
                onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
                placeholder="Nagy János"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_person_phone">Kapcsolattartó telefon</Label>
                <Input
                  id="contact_person_phone"
                  value={formData.contact_person_phone}
                  onChange={(e) => handleInputChange('contact_person_phone', e.target.value)}
                  placeholder="+36 30 123 4567"
                />
              </div>

              <div>
                <Label htmlFor="contact_person_email">Kapcsolattartó email</Label>
                <Input
                  id="contact_person_email"
                  type="email"
                  value={formData.contact_person_email}
                  onChange={(e) => handleInputChange('contact_person_email', e.target.value)}
                  placeholder="janos@menhely.hu"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={formData.verified}
                  onCheckedChange={(checked) => handleInputChange('verified', checked)}
                />
                <Label htmlFor="verified" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Ellenőrzött menhely
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verification_requested"
                  checked={formData.verification_requested}
                  onCheckedChange={(checked) => handleInputChange('verification_requested', checked)}
                />
                <Label htmlFor="verification_requested" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Ellenőrzés kérve
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured" className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-600" />
                  Kiemelt menhely (főoldalon megjelenik)
                </Label>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || uploading} className="min-w-32">
          {(isLoading || uploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {submitLabel}
        </Button>
      </div>

      {/* Click outside to close city dropdown */}
      {cityDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setCityDropdownOpen(false)}
        />
      )}
    </form>
  );
}
