
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import {
  Plus,
  Calendar as CalendarIcon,
  Trash2,
  List,
  Edit,
  ArrowLeft,
  X,
  Upload,
  Image,
  Loader2,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { hungarianCounties, budapestDistricts } from '../components/shared/hungarian-locations';

const initialEventState = {
  title: '',
  description: '',
  date: null,
  start_time: '',
  end_time: '',
  location: '',
  street_address: '',
  county: '',
  organizer_name: '',
  organization_name: '',
  organizer_phone: '',
  organizer_email: '',
  event_type: '',
  max_participants: '',
  logo_url: '',
  photo_url: '',
  gallery_photos: [],
  registration_required: false,
  entry_fee: 0,
  parking_info: 'Ingyenes parkolás',
  parking_fee: '',
  parking_fee_unit: '/óra',
  program: '',
  program_schedule: [],
  bring_items: [],
  event_website: '',
  facebook_event: '',
  ticket_link: ''
};

// Segítség szövegek minden szekcióhoz
const helpTexts = {
  alapadatok: {
    title: "🎯 Alapadatok",
    content: `**Esemény címe:** A cím legyen informatív és figyelemfelkeltő. Jó példák: "Tavaszi Örökbefogadó Nap", "Jótékonysági Kutyafutás", "Macska Nevelési Workshop". Kerüld a túl általános címeket, mint "Esemény" vagy "Program".

**Leírás:** Itt adj részletes tájékoztatást az eseményről. Írd le, mi fog történni, kinek ajánlod, mire számíthatnak a résztvevők. Ez a szöveg fog megjelenni az esemény részletes oldalán, ezért legyen vonzó és informatív.

**Esemény típusa** pl.:
• **Örökbefogadó nap:** Állatbemutatók, örökbefogadási lehetőségek
• **Jótékonysági esemény:** Adománygyűjtés, támogatói rendezvények
• **Oktató program:** Workshops, előadások, tanfolyamok
• **Közösségi találkozó:** Gazdi meetup-ok, tapasztalatcsere`
  },
  szervezok: {
    title: "👥 Szervezők",
    content: `**Szervező neve vs. Szervezet neve:**
• **Szervező neve:** Közismert név, rövidített név vagy márkanév, (pl. "Nagy Péter")
• **Szervezet neve:** Hivatalos szervezet megnevezése (pl. "Budai Állatvédők a Kisállatokért Alapítvány")

**Kapcsolati adatok:** Az email cím és telefonszám kötelező - ezen tudnak majd érdeklődni a résztvevők. Győződj meg róla, hogy naprakészek és elérhetőek.`
  },
  helyszin: {
    title: "📍 Helyszín és Időpont",
    content: `**Vármegye kiválasztása:** Az első lépés mindig a vármegye. Enélkül a város mező nem aktiválódik. Budapest választása esetén automatikusan kerületválasztóra vált a rendszer.

**Város/Kerület választása:**
• **Vidéken:** Kezdj el gépelni, és a rendszer felajánlja a lehetséges városokat
• **Budapesten:** Válassz a 23 kerület közül a legördülő menüből

**Pontos cím:** Az "Utca vagy pontos helyszín" mezőbe írd be a teljes címet vagy egy jól felismerhető helymegjelölést (pl. "Fő út 15." vagy "Városháza mögötti park").

**Dátum és időpont:** A naptár ablakban kattints a kívánt napra. Az időpontokat 24 órás formátumban add meg (pl. "09:00", "14:30").`
  },
  kepek: {
    title: "🖼️ Képek",
    content: `**Profilkép/Logó:**
• Ideális méret: négyzetes, egyéb képaránynál kivágja a kép közepétől
• Ez jelenik meg a listák mellett, legyen felismerhető
• Lehet a szervezet logója vagy az esemény szimbóluma

**Borítókép:**
• Ideális méret: 1200x600 px, fekvő tájolás (mint a facebook borító)
• Nagy, látványos kép az esemény fejlécéhez
• Mutassa be a helyszínt vagy a hangulatot

**Galéria:**
• Egyszerre több kép feltöltésének lehetősége
• Javasolt képszám: 4-8 darab
• Mutasd be a helyszínt, korábbi eseményeket, várható programokat`
  },
  koltsegek: {
    title: "💰 Költségek",
    content: `**Belépő ár:**
• Ingyenes esemény: hagyd 0-n vagy üresen
• Fizetős esemény: csak a számot írd be (pl. "1500")
• A rendszer forintban számol automatikusan

**Parkolási információk:**
• "Ingyenes parkolás" választása esetén nincs további teendő
• "Fizetős" választásakor megjelenik díj és egység mező
• "Korlátozott" vagy "Nincs" esetén részletezd a leírásban`
  },
  program: {
    title: "📋 Program",
    content: `**Egyszerű program:** szövegben leírhatod a program menetét. Jó kis eseményekhez vagy amikor nincs szükség részletes időbeosztásra.

**Részletes program:** Kapcsold be a kapcsolót, ha pontos időbeosztást akarsz megadni:
• **Időpont:** pl. "09:00", "14:30"
• **Tevékenység:** röviden, pl. "Regisztráció", "Állatbemutató"
• **Leírás:** részletesebb kifejtés, ha szükséges

• **"Sor hozzáadása" gomb:** Új programpont felvételéhez
• **Kuka ikon:** Programpont törlése`
  },
  gyakorlati: {
    title: "🎒 Gyakorlati Információk",
    content: `**Mit hozz magaddal:** Gépelés után nyomj vesszőt (,) vagy Entert - az elem megjelenik címkeként. Példák: "Póráz", "Igazolvány", "Kényelmes cipő", "Jó hangulat".

**Regisztráció kötelező:** Kapcsold be, ha előzetes jelentkezés szükséges. Ez információt ad a látogatóknak a tervezéshez.

**Maximum résztvevők száma:** Ha van létszámkorlátozás, add meg a számot. Ez segít a szervezésben és a résztvevők tájékoztatásában.`
  },
  online: {
    title: "🌐 Online Jelenlét",
    content: `**Weboldal, Facebook, Jegyvásárlás:** Ezek mind opcionális mezők. Ha van külön esemény oldal vagy jegyértékesítés, itt tudod megadni a linkeket. A teljes URL-t írd be (https://www.példa.hu).`
  }
};

// Segítség Modal Komponens
const HelpModal = ({ helpKey, children }) => {
  const helpText = helpTexts[helpKey];

  if (!helpText) {
    console.error(`Help text for key "${helpKey}" not found.`);
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {helpText.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm"> {/* Added text-sm for slightly smaller font */}
          {helpText.content.split('\n\n').map((paragraph, index) => (
            <div key={index} className="text-gray-700">
              {paragraph.split('\n').map((line, lineIndex) => {
                // Handle bold text
                if (line.includes('**')) {
                  const parts = line.split('**');
                  return (
                    <p key={lineIndex} className={lineIndex > 0 ? 'mt-1' : ''}>
                      {parts.map((part, partIndex) =>
                        partIndex % 2 === 1 ?
                          <strong key={partIndex} className="font-semibold text-gray-900">{part}</strong> :
                          part
                      )}
                    </p>
                  );
                }
                // Handle bullet points
                if (line.startsWith('• ')) {
                  return (
                    <p key={lineIndex} className="ml-4 mt-1 flex items-start">
                      <span className="text-blue-600 font-bold mr-2">•</span>
                      <span>{line.substring(2)}</span>
                    </p>
                  );
                }
                return line ? <p key={lineIndex} className={lineIndex > 0 ? 'mt-1' : ''}>{line}</p> : null;
              })}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Segítség Gomb Komponens
const HelpButton = ({ helpKey }) => (
  <HelpModal helpKey={helpKey}>
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-500 hover:text-blue-600 h-auto p-1"
      type="button"
    >
      <Info className="w-4 h-4 mr-1" />
      <span className="text-xs">Segítség</span>
    </Button>
  </HelpModal>
);

const ImageUpload = ({
  label,
  currentUrl,
  onUpload,
  multiple = false,
  accept = "image/*",
  isUploading = false
}) => {
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      if (multiple) {
        const uploadPromises = files.map(file => UploadFile({ file }));
        const results = await Promise.all(uploadPromises);
        const urls = results.map(result => result.file_url);
        onUpload(urls);
      } else {
        const result = await UploadFile({ file: files[0] });
        onUpload(result.file_url);
      }
      toast.success('Kép(ek) sikeresen feltöltve!');
    } catch (error) {
      console.error('Hiba a feltöltés során:', error);
      toast.error('Hiba történt a feltöltés során.');
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            onChange={handleFileChange}
            accept={accept}
            multiple={multiple}
            disabled={isUploading}
            className="cursor-pointer"
          />
        </div>
        {isUploading && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Feltöltés...</span>
          </div>
        )}
      </div>

      {/* Preview */}
      {!multiple && currentUrl && (
        <div className="mt-2">
          <img
            src={currentUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}

      {multiple && currentUrl && Array.isArray(currentUrl) && currentUrl.length > 0 && (
        <div className="mt-2 grid grid-cols-4 gap-2">
          {currentUrl.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg border"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState(event || {
    ...initialEventState,
    // Set default date if it's a new event and initialEventState.date is null
    date: initialEventState.date === null ? new Date() : initialEventState.date
  });
  const [bringItemInput, setBringItemInput] = useState('');
  const [uploadingStates, setUploadingStates] = useState({
    logo: false,
    cover: false,
    gallery: false
  });

  // Location state
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    // Populate form with existing data
    if (event) {
      // If event data is passed, update the form state
      setFormData(prev => ({ ...prev, ...event }));
      // Also set the initial city search term if location exists
      if (event.location) {
        setCitySearchTerm(event.location);
      }
    } else {
      // For new events, ensure date is always initialized to current date if it's null
      setFormData(prev => ({
        ...initialEventState,
        date: initialEventState.date === null ? new Date() : initialEventState.date
      }));
    }
  }, [event]);

  useEffect(() => {
    // Update available cities when county changes
    if (formData.county === 'Budapest') {
      setAvailableCities(budapestDistricts);
    } else {
      const cities = hungarianCounties[formData.county] || [];
      setAvailableCities(cities);
    }

    // If the current city is not in the new county/district list, clear it
    const newCities = formData.county === 'Budapest' ? budapestDistricts : (hungarianCounties[formData.county] || []);
    if (formData.location && !newCities.includes(formData.location)) {
      setFormData(prev => ({ ...prev, location: '' }));
      setCitySearchTerm('');
    }
  }, [formData.county, formData.location]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, entry_fee: value === '' ? '' : Number(value) })); // Allow empty string for clearing
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.program_schedule];
    newSchedule[index][field] = value;
    setFormData(prev => ({ ...prev, program_schedule: newSchedule }));
  };

  const addScheduleRow = () => {
    setFormData(prev => ({
      ...prev,
      program_schedule: [...prev.program_schedule, { time: '', activity: '', description: '' }]
    }));
  };

  const removeScheduleRow = (index) => {
    const newSchedule = formData.program_schedule.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, program_schedule: newSchedule }));
  };

  const handleBringItemKeyDown = (e) => {
    if ((e.key === ',' || e.key === 'Enter') && bringItemInput.trim() !== '') {
      e.preventDefault();
      const newItem = bringItemInput.trim().replace(/,$/, '');
      if (!formData.bring_items.includes(newItem)) {
        setFormData(prev => ({ ...prev, bring_items: [...prev.bring_items, newItem] }));
      }
      setBringItemInput('');
    }
  };

  const removeBringItem = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      bring_items: prev.bring_items.filter(item => item !== itemToRemove)
    }));
  };

  const handleLogoUpload = async (url) => {
    setUploadingStates(prev => ({ ...prev, logo: true }));
    setFormData(prev => ({ ...prev, logo_url: url }));
    setUploadingStates(prev => ({ ...prev, logo: false }));
  };

  const handleCoverUpload = async (url) => {
    setUploadingStates(prev => ({ ...prev, cover: true }));
    setFormData(prev => ({ ...prev, photo_url: url }));
    setUploadingStates(prev => ({ ...prev, cover: false }));
  };

  const handleGalleryUpload = async (urls) => {
    setUploadingStates(prev => ({ ...prev, gallery: true }));
    setFormData(prev => ({
      ...prev,
      gallery_photos: [...(prev.gallery_photos || []), ...urls]
    }));
    setUploadingStates(prev => ({ ...prev, gallery: false }));
  };

  const handleCitySearchChange = (e) => {
    const value = e.target.value;
    setCitySearchTerm(value);
    if (value) {
      const suggestions = availableCities.filter(city =>
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setCitySuggestions(suggestions);
    } else {
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({ ...prev, location: city }));
    setCitySearchTerm(city);
    setCitySuggestions([]);
  };

  const handleCityBlur = () => {
    // After a short delay, check if the input matches the stored value
    // This allows click event on suggestions to fire before blur hides them
    setTimeout(() => {
      // Revert citySearchTerm to formData.location only if it's different
      // and formData.location is not empty.
      // This handles cases where user types something that's not a valid city
      // or doesn't select from suggestions.
      if (formData.location && citySearchTerm !== formData.location) {
        setCitySearchTerm(formData.location);
      } else if (!formData.location && citySearchTerm) {
        // If formData.location is empty but user typed something, clear it
        setCitySearchTerm('');
      }
      setCitySuggestions([]); // Hide suggestions
    }, 200);
  };

  const handleLocationChange = (value) => {
    setFormData(prev => ({ ...prev, location: value }));
    if (formData.county !== 'Budapest') {
      setCitySearchTerm(value);
      setCitySuggestions([]);
    }
  };

  const counties = Object.keys(hungarianCounties).sort();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onCancel} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {event ? 'Esemény szerkesztése' : 'Új esemény létrehozása'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Alapadatok */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Alapadatok</CardTitle>
              <CardDescription>Az esemény alapvető információi</CardDescription>
            </div>
            <HelpButton helpKey="alapadatok" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Esemény címe *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="pl. Örökbefogadó nap a Mancs Menhelyen"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Esemény leírása</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Részletes leírás az eseményről..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event_type">Esemény típusa</Label>
                <Select value={formData.event_type} onValueChange={(value) => handleInputChange({ target: { name: 'event_type', value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Válassz típust..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orokbefogado_nap">Örökbefogadó nap</SelectItem>
                    <SelectItem value="jotekonysagi_esemeny">Jótékonysági esemény</SelectItem>
                    <SelectItem value="oktato_program">Oktató program</SelectItem>
                    <SelectItem value="kozossegi_talalkozo">Közösségi találkozó</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="max_participants">Maximum résztvevők száma</Label>
                <Input
                  id="max_participants"
                  name="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={handleInputChange}
                  placeholder="Hagyd üresen, ha nincs limit"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Szervezők */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Szervezők</CardTitle>
              <CardDescription>Kapcsolattartási és szervezői információk</CardDescription>
            </div>
            <HelpButton helpKey="szervezok" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizer_name">Szervező neve *</Label>
                <Input
                  id="organizer_name"
                  name="organizer_name"
                  value={formData.organizer_name}
                  onChange={handleInputChange}
                  placeholder="pl. Mancs Kutyaiskola"
                  required
                />
              </div>

              <div>
                <Label htmlFor="organization_name">Szervezet neve</Label>
                <Input
                  id="organization_name"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleInputChange}
                  placeholder="pl. Mancs egyesület"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizer_phone">Szervező telefonszáma</Label>
                <Input
                  id="organizer_phone"
                  name="organizer_phone"
                  value={formData.organizer_phone}
                  onChange={handleInputChange}
                  placeholder="+36 30 123 4567"
                />
              </div>

              <div>
                <Label htmlFor="organizer_email">Szervező email címe</Label>
                <Input
                  id="organizer_email"
                  name="organizer_email"
                  type="email"
                  value={formData.organizer_email}
                  onChange={handleInputChange}
                  placeholder="kapcsolat@mancskutyaiskola.hu"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Helyszín és időpont */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Helyszín és időpont</CardTitle>
            </div>
            <HelpButton helpKey="helyszin" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="county">Vármegye *</Label>
                <Select
                  value={formData.county}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, county: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Válassz vármegyét..." />
                  </SelectTrigger>
                  <SelectContent>
                    {counties.map(county => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dinamikus város/kerület mező */}
              {formData.county === 'Budapest' ? (
                <div>
                  <Label htmlFor="district">Kerület *</Label>
                  <Select value={formData.location} onValueChange={handleLocationChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Válassz kerületet" />
                    </SelectTrigger>
                    <SelectContent>
                      {budapestDistricts.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="relative">
                  <Label htmlFor="location">Helyszín (Város) *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={citySearchTerm}
                    onChange={handleCitySearchChange}
                    onBlur={handleCityBlur}
                    placeholder="Kezdj el gépelni..."
                    required
                    autoComplete="off"
                    disabled={!formData.county}
                  />
                  {citySuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                      {citySuggestions.slice(0, 10).map(city => (
                        <div
                          key={city}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleCitySelect(city)}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="street_address">Utca vagy pontos helyszín</Label>
              <Input
                id="street_address"
                name="street_address"
                value={formData.street_address || ''}
                onChange={handleInputChange}
                placeholder="pl. Váci út 1-3."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Esemény dátuma *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(new Date(formData.date), 'yyyy. MMMM dd.', { locale: hu }) : 'Válassz dátumot'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date ? new Date(formData.date) : undefined}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="start_time">Kezdés időpontja</Label>
                <Input
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="end_time">Befejezés időpontja</Label>
                <Input
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Képek */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Képek</CardTitle>
              <CardDescription>Profilkép, borítókép és galéria feltöltése</CardDescription>
            </div>
            <HelpButton helpKey="kepek" />
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUpload
              label="Profilkép/Logó"
              currentUrl={formData.logo_url}
              onUpload={handleLogoUpload}
              isUploading={uploadingStates.logo}
            />

            <ImageUpload
              label="Borítókép"
              currentUrl={formData.photo_url}
              onUpload={handleCoverUpload}
              isUploading={uploadingStates.cover}
            />

            <ImageUpload
              label="Galéria (több kép egyszerre is választható)"
              currentUrl={formData.gallery_photos}
              onUpload={handleGalleryUpload}
              multiple={true}
              isUploading={uploadingStates.gallery}
            />
          </CardContent>
        </Card>

        {/* Költségek */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Költségek</CardTitle>
              <CardDescription>Belépő és parkolási díjak</CardDescription>
            </div>
            <HelpButton helpKey="koltsegek" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="entry_fee">Belépő ár (Ft) - 0 = ingyenes</Label>
              <Input
                id="entry_fee"
                name="entry_fee"
                type="number"
                value={formData.entry_fee}
                onChange={handleFeeChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parking_info">Parkolási információk</Label>
              <Select
                value={formData.parking_info}
                onValueChange={(value) => handleInputChange({ target: { name: 'parking_info', value } })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ingyenes parkolás">Ingyenes parkolás</SelectItem>
                  <SelectItem value="Fizetős">Fizetős</SelectItem>
                </SelectContent>
              </Select>

              {formData.parking_info === 'Fizetős' && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label htmlFor="parking_fee">Parkolási díj</Label>
                    <Input
                      id="parking_fee"
                      name="parking_fee"
                      type="number"
                      value={formData.parking_fee}
                      onChange={handleInputChange}
                      placeholder="500"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parking_fee_unit">Egység</Label>
                    <Select
                      value={formData.parking_fee_unit}
                      onValueChange={(value) => handleInputChange({ target: { name: 'parking_fee_unit', value } })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/óra">/óra</SelectItem>
                        <SelectItem value="/nap">/nap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Program */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Program</CardTitle>
              <CardDescription>Az esemény programjának részletei</CardDescription>
            </div>
            <HelpButton helpKey="program" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="program_type"
                checked={formData.program_type === 'detailed'}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, program_type: checked ? 'detailed' : 'simple' }))
                }
              />
              <Label htmlFor="program_type">Részletes időbeosztás használata</Label>
            </div>

            {formData.program_type === 'simple' ? (
              <div>
                <Label htmlFor="program">Program egyszerű leírása</Label>
                <Textarea
                  id="program"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  placeholder="Rövid leírás a program menetéről..."
                  rows={4}
                />
              </div>
            ) : (
              <div>
                <Label>Részletes időbeosztás</Label>
                <div className="space-y-4">
                  {(formData.program_schedule || []).map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-2">
                        <Input
                          type="time"
                          value={item.time}
                          onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                          placeholder="10:00"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          value={item.activity}
                          onChange={(e) => handleScheduleChange(index, 'activity', e.target.value)}
                          placeholder="Tevékenység"
                        />
                      </div>
                      <div className="col-span-6">
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleScheduleChange(index, 'description', e.target.value)}
                          placeholder="Leírás (opcionális)"
                          rows={1}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeScheduleRow(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addScheduleRow}
                    className="w-full border-dashed border-2 py-8 text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Új sor hozzáadása
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gyakorlati információk */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gyakorlati információk</CardTitle>
              <CardDescription>További hasznos információk a résztvevők számára</CardDescription>
            </div>
            <HelpButton helpKey="gyakorlati" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="registration_required"
                name="registration_required"
                checked={formData.registration_required}
                onCheckedChange={(checked) => handleInputChange({ target: { name: 'registration_required', type: 'checkbox', checked } })}
              />
              <Label htmlFor="registration_required">Regisztráció szükséges</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bring_item_input">Mit hozz magaddal</Label>
              <Input
                id="bring_item_input"
                value={bringItemInput}
                onChange={(e) => setBringItemInput(e.target.value)}
                onKeyDown={handleBringItemKeyDown}
                placeholder="pl. személyazonosító, jó hangulat, póráz..."
              />
            </div>

            {formData.bring_items.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.bring_items.map((item, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer">
                    {item}
                    <X
                      className="w-3 h-3 ml-1 hover:text-red-500"
                      onClick={() => removeBringItem(item)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Online jelenlétek */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Online jelenlét</CardTitle>
              <CardDescription>Weboldal és közösségi média linkek</CardDescription>
            </div>
            <HelpButton helpKey="online" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="event_website">Esemény webhelye</Label>
              <Input
                id="event_website"
                name="event_website"
                type="url"
                value={formData.event_website}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="facebook_event">Facebook esemény link</Label>
              <Input
                id="facebook_event"
                name="facebook_event"
                type="url"
                value={formData.facebook_event}
                onChange={handleInputChange}
                placeholder="https://facebook.com/events/..."
              />
            </div>

            <div>
              <Label htmlFor="ticket_link">Jegyvásárlási link</Label>
              <Input
                id="ticket_link"
                name="ticket_link"
                type="url"
                value={formData.ticket_link}
                onChange={handleInputChange}
                placeholder="https://ticket-platform.com/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Akció gombok */}
        <div className="flex justify-end gap-4 pt-8">
          <Button type="button" variant="outline" onClick={onCancel}>
            Mégse
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {event ? 'Változások mentése' : 'Esemény létrehozása'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default function AdminManageEventsPage() {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Szimulált adatbetöltés - később ez lesz az Event.list() hívás
    setTimeout(() => {
      setEvents([]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddNew = () => {
    setSelectedEvent(null);
    setView('form');
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setView('form');
  };

  const handleSave = (eventData) => {
    console.log('Esemény mentése:', eventData);
    toast.success(selectedEvent ? 'Esemény sikeresen frissítve!' : 'Esemény sikeresen létrehozva!');
    setView('list');
  };

  const handleCancel = () => {
    setSelectedEvent(null);
    setView('list');
  };

  if (view === 'form') {
    return (
      <AdminLayout>
        <EventForm
          event={selectedEvent}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Események kezelése</h1>
            <p className="text-gray-600">
              Események létrehozása és szerkesztése
            </p>
          </div>
          <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" />
            Új esemény
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid gap-4">
            {events.map(event => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-gray-600">{event.date} • {event.location}</p>
                    </div>
                    <Button variant="outline" onClick={() => handleEdit(event)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Szerkesztés
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <List className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nincsenek események</h3>
              <p className="text-gray-600 mb-4">
                Még nincsenek események létrehozva.
              </p>
              <Button onClick={handleAddNew} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Első esemény létrehozása
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
