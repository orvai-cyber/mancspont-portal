
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Plus, Save, Building } from 'lucide-react';
import { UploadFile } from '@/api/integrations';
import { toast } from 'sonner';
import { User, Shelter } from '@/api/entities';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Assuming Card components are available

const personalityOptions = [
  'barátságos', 'játékos', 'nyugodt', 'energikus',
  'szerető', 'védelmező', 'független', 'szociális'
];

export default function AnimalForm({ animal, onSubmit, submitLabel = "Mentés", isLoading: propIsLoading = false }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [shelters, setShelters] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Internal state for saving process

  const [formData, setFormData] = useState({
    name: '',
    species: 'kutya',
    breed: '',
    age: 'felnott',
    age_months: 0,
    size: 'kozepes',
    gender: 'him',
    description: '',
    personality: [],
    photos: [],
    shelter_name: '',
    location: '',
    county: 'Budapest',
    is_urgent: false,
    is_special_needs: false,
    vaccinated: false,
    sterilized: false,
    microchipped: false,
  });

  // Helper functions to get shelter location and county by name
  const getShelterLocation = (shelterName, sheltersData) => {
    const shelter = sheltersData.find(s => s.name === shelterName);
    return shelter?.location || '';
  };

  const getShelterCounty = (shelterName, sheltersData) => {
    const shelter = sheltersData.find(s => s.name === shelterName);
    return shelter?.county || '';
  };

  const loadInitialData = useCallback(async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      let fetchedShelters = [];

      // Only fetch shelters if the user is a site admin,
      // as they are the only ones who can choose.
      if (user.role === 'admin') {
        fetchedShelters = await Shelter.list();
      } else if (user.shelter_name) {
        // If it's a shelter admin, we only need their own shelter info
        const shelterData = await Shelter.filter({ name: user.shelter_name });
        if (shelterData.length > 0) {
            fetchedShelters = shelterData; // List will only contain one item
        }
      }
      setShelters(fetchedShelters);
      
      // Ha menhely admin, automatikusan állítsuk be a menhely nevét
      // This also ensures 'fetchedShelters' is used for location/county if available
      if (user.shelter_name && !animal) {
        setFormData(prev => {
            const currentShelter = fetchedShelters.find(s => s.name === user.shelter_name);
            return {
                ...prev,
                shelter_name: user.shelter_name,
                location: prev.location || currentShelter?.location || '',
                county: prev.county || currentShelter?.county || ''
            };
        });
      }
    } catch (error) {
      console.error('Hiba az adatok betöltésekor:', error);
    }
  }, [animal]); // Removed getShelterLocation, getShelterCounty from dependencies as their direct use case here is replaced

  // Load initial data (user and shelters) on component mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Update form data when the animal prop changes (e.g., for editing existing animal)
  useEffect(() => {
    if (animal) {
      setFormData({
        name: animal.name || '',
        species: animal.species || 'kutya',
        breed: animal.breed || '',
        age: animal.age || 'felnott',
        age_months: animal.age_months || 0,
        size: animal.size || 'kozepes',
        gender: animal.gender || 'him',
        description: animal.description || '',
        personality: Array.isArray(animal.personality) ? animal.personality : [],
        photos: Array.isArray(animal.photos) ? animal.photos : [],
        shelter_name: animal.shelter_name || '',
        location: animal.location || '',
        county: animal.county || 'Budapest',
        is_urgent: animal.is_urgent || false,
        is_special_needs: animal.is_special_needs || false,
        vaccinated: animal.vaccinated || false,
        sterilized: animal.sterilized || false,
        microchipped: animal.microchipped || false,
      });
    }
  }, [animal]);

  // Determine user roles
  const isSiteAdmin = currentUser?.role === 'admin';
  const isShelterAdmin = currentUser?.shelter_name && !isSiteAdmin;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonalityToggle = (trait) => {
    setFormData(prev => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter(t => t !== trait)
        : [...prev.personality, trait]
    }));
  };

  const handleMultipleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => UploadFile({ file }));
      const uploadResults = await Promise.all(uploadPromises);
      const newPhotos = uploadResults.map(result => result.file_url);

      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
      toast.success('Képek sikeresen feltöltve!');
    } catch (error) {
      console.error('Hiba a fájlok feltöltésekor:', error);
      toast.error('Hiba a képek feltöltésekor.');
    } finally {
      setUploading(false);
      // Clear the file input after upload to allow re-uploading same files
      e.target.value = null;
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Az állat neve kötelező!");
      return;
    }

    if (!formData.shelter_name) {
      toast.error("Menhely kiválasztása kötelező!");
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error saving animal:", error);
      toast.error("Hiba történt a mentés során.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentLoadingState = propIsLoading || isSaving || uploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Menhely információk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Menhely információk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="shelter_name">
              Menhely neve *
              {isShelterAdmin && (
                <Badge variant="secondary" className="ml-2">
                  Automatikusan beállítva
                </Badge>
              )}
            </Label>
            {isSiteAdmin ? (
              // Site admin: választhat menhelyet
              <Select
                value={formData.shelter_name}
                onValueChange={(value) => {
                  handleInputChange('shelter_name', value);
                  // Automatikusan állítsuk be a menhely helyét és megyéjét
                  const selectedShelter = shelters.find(s => s.name === value);
                  if (selectedShelter) {
                    handleInputChange('location', selectedShelter.location);
                    handleInputChange('county', selectedShelter.county);
                  }
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Válassz menhelyet..." />
                </SelectTrigger>
                <SelectContent>
                  {shelters.map(shelter => (
                    <SelectItem key={shelter.id} value={shelter.name}>
                      {shelter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              // Menhely admin: nem választhat, csak a sajátja
              <Input
                id="shelter_name"
                value={formData.shelter_name}
                disabled
                className="bg-gray-50 text-gray-700 mt-1"
                placeholder={currentUser ? "Saját menhely automatikusan beállítva" : "Nincs menhely hozzárendelve"}
              />
            )}
            {isShelterAdmin && (
              <p className="text-sm text-gray-600 mt-1">
                Az állatokat automatikusan a saját menhelyéhez ({currentUser?.shelter_name || 'ismeretlen'}) rendeljük.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="location">Város/Helység *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
              disabled={isShelterAdmin} // Disable if shelter admin, as it's pre-filled
            />
          </div>

          <div>
            <Label htmlFor="county">Vármegye *</Label>
            <Select
              value={formData.county}
              onValueChange={(value) => handleInputChange('county', value)}
              disabled={isShelterAdmin} // Disable if shelter admin, as it's pre-filled
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Budapest">Budapest</SelectItem>
                <SelectItem value="Bács-Kiskun">Bács-Kiskun</SelectItem>
                <SelectItem value="Baranya">Baranya</SelectItem>
                <SelectItem value="Békés">Békés</SelectItem>
                <SelectItem value="Borsod-Abaúj-Zemplén">Borsod-Abaúj-Zemplén</SelectItem>
                <SelectItem value="Csongrád-Csanád">Csongrád-Csanád</SelectItem>
                <SelectItem value="Fejér">Fejér</SelectItem>
                <SelectItem value="Győr-Moson-Sopron">Győr-Moson-Sopron</SelectItem>
                <SelectItem value="Hajdú-Bihar">Hajdú-Bihar</SelectItem>
                <SelectItem value="Heves">Heves</SelectItem>
                <SelectItem value="Jász-Nagykun-Szolnok">Jász-Nagykun-Szolnok</SelectItem>
                <SelectItem value="Komárom-Esztergom">Komárom-Esztergom</SelectItem>
                <SelectItem value="Nógrád">Nógrád</SelectItem>
                <SelectItem value="Pest">Pest</SelectItem>
                <SelectItem value="Somogy">Somogy</SelectItem>
                <SelectItem value="Szabolcs-Szatmár-Bereg">Szabolcs-Szatmár-Bereg</SelectItem>
                <SelectItem value="Tolna">Tolna</SelectItem>
                <SelectItem value="Vas">Vas</SelectItem>
                <SelectItem value="Veszprém">Veszprém</SelectItem>
                <SelectItem value="Zala">Zala</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alapadatok */}
      <h3 className="text-lg font-semibold">Alapinformációk</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Állat neve *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Az állat neve"
            required
          />
        </div>

        <div>
          <Label htmlFor="species">Faj *</Label>
          <Select value={formData.species} onValueChange={(value) => handleInputChange('species', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Válassz fajt" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kutya">Kutya</SelectItem>
              <SelectItem value="macska">Macska</SelectItem>
              <SelectItem value="nyul">Nyúl</SelectItem>
              <SelectItem value="hazhigor">Házihörcsög</SelectItem>
              <SelectItem value="madar">Madár</SelectItem>
              <SelectItem value="egyeb">Egyéb</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="breed">Fajta</Label>
          <Input
            id="breed"
            value={formData.breed}
            onChange={(e) => handleInputChange('breed', e.target.value)}
            placeholder="pl. Labrador, Perzsa, stb."
          />
        </div>

        <div>
          <Label htmlFor="age_months">Kor (hónapban)</Label>
          <Input
            id="age_months"
            type="number"
            value={formData.age_months}
            onChange={(e) => handleInputChange('age_months', parseInt(e.target.value, 10) || 0)}
            min="0"
          />
        </div>

        <div>
          <Label htmlFor="age">Életkor kategória</Label>
          <Select value={formData.age} onValueChange={(value) => handleInputChange('age', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kolyok">Kölyök</SelectItem>
              <SelectItem value="felnott">Felnőtt</SelectItem>
              <SelectItem value="idos">Idős</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="size">Méret</Label>
          <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kicsi">Kicsi</SelectItem>
              <SelectItem value="kozepes">Közepes</SelectItem>
              <SelectItem value="nagy">Nagy</SelectItem>
              <SelectItem value="oriasi">Óriás</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gender">Nem</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="him">Hím</SelectItem>
              <SelectItem value="nosteny">Nőstény</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leírás */}
      <div>
        <Label htmlFor="description">Leírás</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          placeholder="Röviden mutasd be az állatot..."
        />
      </div>

      {/* Personality Traits */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Személyiségvonások</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {personalityOptions.map(trait => (
            <Badge
              key={trait}
              variant={formData.personality.includes(trait) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handlePersonalityToggle(trait)}
            >
              {trait}
            </Badge>
          ))}
        </div>
      </div>

      {/* Fényképek */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Fényképek</h3>
        <div className="space-y-4 mt-2">
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img src={photo} alt={`Állat fotó ${index + 1}`} className="w-full h-24 object-cover rounded border" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleFileUpload}
              className="hidden"
              id="photos-upload"
              disabled={uploading}
            />
            <Label htmlFor="photos-upload" className="cursor-pointer">
              <Button type="button" variant="outline" asChild disabled={uploading}>
                <span>
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Fényképek feltöltése
                </span>
              </Button>
            </Label>
          </div>
        </div>
      </div>

      {/* Egészségügyi információk */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Egészségügyi információk</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vaccinated"
              checked={formData.vaccinated}
              onCheckedChange={(checked) => handleInputChange('vaccinated', checked)}
            />
            <Label htmlFor="vaccinated">Oltott</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sterilized"
              checked={formData.sterilized}
              onCheckedChange={(checked) => handleInputChange('sterilized', checked)}
            />
            <Label htmlFor="sterilized">Sterilizált/Ivartalanított</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="microchipped"
              checked={formData.microchipped}
              onCheckedChange={(checked) => handleInputChange('microchipped', checked)}
            />
            <Label htmlFor="microchipped">Chippelt</Label>
          </div>
        </div>
      </div>

      {/* Speciális jelzések */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Speciális jelzések</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_urgent"
              checked={formData.is_urgent}
              onCheckedChange={(checked) => handleInputChange('is_urgent', checked)}
            />
            <Label htmlFor="is_urgent">Sürgős örökbefogadást igényel</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_special_needs"
              checked={formData.is_special_needs}
              onCheckedChange={(checked) => handleInputChange('is_special_needs', checked)}
            />
            <Label htmlFor="is_special_needs">Különleges gondozást igényel</Label>
          </div>
        </div>
      </div>

      {/* Mentés gomb */}
      <div className="flex justify-end">
        <Button type="submit" disabled={currentLoadingState} className="px-8">
          {currentLoadingState ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Mentés...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
