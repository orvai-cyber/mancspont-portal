
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { UploadFile } from '@/api/integrations';
import { X, PlusCircle, Save, Trash2, Image as ImageIcon, Loader2, Facebook, Instagram, Youtube, Search, Info } from 'lucide-react';
import { toast } from 'sonner';
import { hungarianCounties, budapestDistricts } from '@/components/shared/hungarian-locations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch'; // Added as per outline, though not directly used in the form logic

const countiesList = Object.keys(hungarianCounties);
const daysOfWeek = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

const AutocompleteCity = ({ county, value, onSelect, disabled }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  
  const cities = useMemo(() => {
    return county && hungarianCounties[county] ? hungarianCounties[county] : [];
  }, [county]);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (inputValue) {
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  }, [inputValue, cities]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(newValue.length > 0 && cities.length > 0);
  };

  const handleCitySelect = (city) => {
    setInputValue(city);
    setIsOpen(false);
    onSelect(city);
  };

  const handleInputFocus = () => {
    if (cities.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow click on dropdown items
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Kezdd el gépelni a város nevét..."
          disabled={disabled}
          className="pr-8"
        />
        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      
      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredCities.map((city) => (
            <div
              key={city}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              onMouseDown={() => handleCitySelect(city)} // Use onMouseDown instead of onClick to prevent blur
            >
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Segítség szövegek minden szekcióhoz
const helpTexts = {
  alapadatok: {
    title: "🏢 Alapadatok",
    content: `**Szolgáltató neve:** Rövid, egyszerű, megjegyezhető név. Jó példák: "Mancs Panzió", "Boldog Kutyák Napközi", "Cicák Otthona". Kerüld a túl hosszú vagy bonyolult neveket.

**Kategória:**
• **Panzió:** Többnapos elhelyezés, akár nyaralás idejére
• **Napközi:** Napi szintű felügyelet, dolgozó gazdiknak
• **Iskola:** Képzések, tréningek, nevelési tanácsadás
• **Szitter:** Alkalmi, rugalmas időpontokban történő felügyelet

**Szlogen/Mottó:** Egy rövid, figyelemfelkeltő mondat ami leírja a szolgáltatásod lényegét. Pl.: "Ahol a kutyák királyként érzik magukat", "Szeretettel várjuk négylábú családtagjaidat".

**Bemutatkozás:** Részletes leírás a szolgáltatásodról. Itt mutatkozz be: milyen tapasztalataid vannak, mit kínálsz, mi tesz különlegessé. Ez fog megjelenni a szolgáltató részletes oldalán.`
  },
  helyszin: {
    title: "📍 Helyszín",
    content: `**Vármegye/Város:** Ugyanaz a logika mint az eseményeknél: először vármegye, utána város. Budapest esetén kerület választás.

**Pontos cím:** Utca és házszám megadása. Ez csak akkor jelenik meg a nyilvános oldalon, ha te engedélyezed a beállításokban. Bizalmi kérdés - sok gazdi szeretné látni, hogy hol van a szolgáltató.

**Elérhetőség:** Írd le, hogyan közelíthető meg tömegközlekedéssel, van-e parkolási lehetőség. Ez sokat segít a gazdiknak a tervezésben.`
  },
  kapcsolat: {
    title: "📞 Kapcsolat és Elérhetőség",
    content: `**Email cím:** Kötelező mező. Itt fognak megkeresni az érdeklődők. Legyen olyan email címed, amit rendszeresen ellenőrzöl.

**Telefonszám:** Szintén kötelező. Magyar formátumban add meg (+36 30 123 4567). Sok gazdi inkább telefonál, mint hogy emailt írjon.

**Weboldal:** Ha van saját weboldalad, add meg a teljes linket (https://www.pelda.hu). Ez nagyobb szakmaiságot sugall.

**Közösségi média:** Facebook, Instagram, TikTok, YouTube linkek. Ha aktívan használod ezeket, mindenképp add meg - sok gazdi itt nézelődik először.`
  },
  szolgaltatasok: {
    title: "🛠️ Szolgáltatások és Árak",
    content: `**Kínált szolgáltatások:** Gépelés után vesszővel vagy Enterrel add hozzá az elemeket. Példák: "Nappali felügyelet", "Sétáltatás", "Gyógyszeradás", "Játék", "Szocializáció".

**Árszint:**
• **Budget:** Kedvező árak, alapszolgáltatások (gazdaságos)
• **Standard:** Átlagos piaci árak, jó ár-érték arány
• **Premium:** Magasabb árak, exkluzív szolgáltatások, luxus

**Részletes árlista:** Itt tudsz konkrét árakat megadni szolgáltatásonként. Pl.:
• Szolgáltatás: "Nappali felügyelet"
• Ár: "3500"
• Egység: "Ft/nap"
• Kezdő ártól: igen (ha változó az ár)`
  },
  nyitvatartas: {
    title: "🕒 Nyitvatartás",
    content: `**Hét napjai:** Minden napra külön beállíthatod:
• **Nyitva:** Nyitás és zárás időpontja (pl. 08:00 - 18:00)
• **Zárva:** Ha az adott napon nem dolgozol
• **Speciális:** Ha különleges időbeosztásod van

**Rugalmasság:** Ha rugalmas vagy az időpontokban, jelezd a leírásban. Sok gazdi keres hétvégi vagy esti szolgáltatást is.`
  },
  kepek: {
    title: "🖼️ Képek",
    content: `**Főkép:** Ez a "arcod" - ez jelenik meg a listákban. Lehetőleg olyan kép legyen, ami jól mutatja a helyet vagy a hangulatot. Négyzetes arány ideális.

**Galéria:** 4-10 kép a szolgáltatásodról:
• A helyszín belső/külső képei
• Hogyan játszanak/pihennek az állatok
• Felszerelések, játékok
• Te magad munkában (bizalomépítés)
• Elégedett "vendég" állatok

**Tippek a jó képekhez:**
• Jó megvilágítás (természetes fény)
• Tiszta, rendezett környezet
• Boldog, aktív állatok
• Ne legyen túl zsúfolt a kép`
  }
};

// HelpModal komponens
const HelpModal = ({ helpKey }) => {
  const helpText = helpTexts[helpKey];
  if (!helpText) return null;

  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith(':**')) {
        return <h4 key={index} className="font-semibold text-gray-800 mt-4 mb-2">{trimmedLine.replace(/\*\*/g, '')}</h4>;
      } else if (trimmedLine.startsWith('• **') && trimmedLine.includes(':**')) {
        const parts = trimmedLine.split(':**');
        const title = parts[0].replace('• **', '');
        const description = parts.slice(1).join(':**');
        return (
          <div key={index} className="mb-2 pl-4">
            <span className="font-medium text-gray-700 pr-1">• {title}:</span>
            <span className="text-gray-600">{description.trim()}</span>
          </div>
        );
      } else if (trimmedLine.startsWith('• ')) {
        return <div key={index} className="text-gray-600 mb-1 pl-4">{trimmedLine}</div>;
      } else if (trimmedLine === '') {
        return <div key={index} className="mb-2"></div>;
      } else {
        return <p key={index} className="text-gray-600 mb-2">{trimmedLine}</p>;
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
          <Info className="w-4 h-4 mr-1" />
          Segítség
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            {helpText.title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-sm">
          {formatContent(helpText.content)}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function ServiceProviderForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'panzio',
    tagline: initialData?.tagline || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    county: initialData?.county || '',
    street_address: initialData?.street_address || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    facebook_url: initialData?.facebook_url || '',
    instagram_url: initialData?.instagram_url || '',
    tiktok_url: initialData?.tiktok_url || '',
    youtube_url: initialData?.youtube_url || '',
    services_offered: initialData?.services_offered || [],
    price_level: initialData?.price_level || 'standard',
    main_photo_url: initialData?.main_photo_url || '',
    gallery_photos: initialData?.gallery_photos || [],
    verified: initialData?.verified || false,
    opening_hours: initialData?.opening_hours || daysOfWeek.map(day => ({ day, open: '09:00', close: '17:00', is_closed: false })),
    pricing: initialData?.pricing || [],
  });
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [serviceInput, setServiceInput] = useState('');

  useEffect(() => {
    // If it's a new service or initialData's opening_hours is empty, initialize opening_hours
    // The `formData` initialization already handles this for new services and empty `initialData.opening_hours`.
    // This `useEffect` might be redundant but preserved for functional consistency with previous logic.
    if (!initialData && formData.opening_hours.length === 0) {
      setFormData(prev => ({
        ...prev,
        opening_hours: daysOfWeek.map(day => ({ day, open: '09:00', close: '17:00', is_closed: false }))
      }));
    }
  }, [initialData, formData.opening_hours.length]);

  // Ár formázás függvény - csak számokat enged és 1000-esekre tagol
  const formatPrice = (value) => {
    // Eltávolítjuk a nem számjegyeket és a szóközöket
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Ha üres, visszaadjuk
    if (!numericValue) return '';
    
    // 1000-esekre tagolás szóközzel
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleCountyChange = (county) => {
    setFormData(prev => ({
      ...prev,
      county: county,
      location: '', // Reset location on county change
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'main') setIsUploadingMain(true);
    if (type === 'gallery') setIsUploadingGallery(true);

    try {
      const { file_url } = await UploadFile({ file });
      if (type === 'main') {
        setFormData(prev => ({ ...prev, main_photo_url: file_url }));
      } else {
        setFormData(prev => ({ ...prev, gallery_photos: [...prev.gallery_photos, file_url] }));
      }
      toast.success('Kép feltöltve!');
    } catch (error) {
      toast.error('Hiba a kép feltöltésekor.');
      console.error(error);
    } finally {
      if (type === 'main') setIsUploadingMain(false);
      if (type === 'gallery') setIsUploadingGallery(false);
    }
  };

  const removeGalleryPhoto = (index) => {
    setFormData(prev => ({ ...prev, gallery_photos: prev.gallery_photos.filter((_, i) => i !== index) }));
  };

  const handleServiceAdd = () => {
    if (serviceInput && !formData.services_offered.includes(serviceInput)) {
      setFormData(prev => ({ ...prev, services_offered: [...prev.services_offered, serviceInput] }));
      setServiceInput('');
    }
  };

  const handleServiceRemove = (serviceToRemove) => {
    setFormData(prev => ({ ...prev, services_offered: formData.services_offered.filter(s => s !== serviceToRemove) }));
  };

  const handlePricingChange = (index, field, value) => {
    const newPricing = [...formData.pricing];
    
    // Ha az ár mezőt módosítjuk, formázzuk
    if (field === 'price') {
      value = formatPrice(value);
    }
    
    newPricing[index] = { ...newPricing[index], [field]: value };
    setFormData({ ...formData, pricing: newPricing });
  };
  
  const addPricingRow = () => {
    setFormData(prev => ({ ...prev, pricing: [...prev.pricing, { service: '', price: '', unit: 'alkalom', from_suffix: false }] }));
  };
  
  const removePricingRow = (index) => {
    setFormData(prev => ({ ...prev, pricing: formData.pricing.filter((_, i) => i !== index) }));
  };

  const handleOpeningHoursChange = (index, field, value) => {
    const newOpeningHours = [...formData.opening_hours];
    newOpeningHours[index] = { ...newOpeningHours[index], [field]: value };
    setFormData(prev => ({ ...prev, opening_hours: newOpeningHours }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location) {
        toast.error("Kérjük, válasszon várost vagy kerületet!");
        return;
    }
    if (!formData.main_photo_url) {
        toast.error("Kérjük, töltsön fel egy profilképet vagy logót!");
        return;
    }
    await onSubmit(formData);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Szolgáltatás szerkesztése' : 'Új szolgáltatás létrehozása'}
          </h1>
          <p className="text-gray-600 mt-1">
            Töltsd ki a szolgáltatásod adatait, hogy megjelenjen a portálon
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Alapinformációk</CardTitle>
            <HelpModal helpKey="alapadatok" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Szolgáltató neve *</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="category">Kategória *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="panzio">Kutyapanzió</SelectItem>
                  <SelectItem value="napköz">Kutyanapközi</SelectItem>
                  <SelectItem value="iskola">Kutyaiskola</SelectItem>
                  <SelectItem value="szitter">Szitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tagline">Mottó / Szlogen (Ajánlott - segít kiemelni szolgáltatásod)</Label>
              <Input id="tagline" value={formData.tagline} onChange={(e) => handleInputChange('tagline', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Leírás (Ajánlott - részletes bemutatkozás növeli a bizalmat)</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Helyszín</CardTitle>
            <HelpModal helpKey="helyszin" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="county">Vármegye *</Label>
                <Select id="county" value={formData.county} onValueChange={handleCountyChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Válassz vármegyét..." />
                  </SelectTrigger>
                  <SelectContent>
                    {countiesList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Város / Kerület *</Label>
                {formData.county === 'Budapest' ? (
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleInputChange('location', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Válassz kerületet" />
                    </SelectTrigger>
                    <SelectContent>
                      {budapestDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <AutocompleteCity
                    county={formData.county}
                    value={formData.location}
                    onSelect={(value) => handleInputChange('location', value)}
                    disabled={!formData.county}
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.county === 'Budapest' 
                    ? 'Válassz egy kerületet a legördülő menüből' 
                    : 'Kezdd el gépelni a város nevét és válassz a listából'
                  }
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="street_address">Utca, házszám (Ajánlott - pontos cím segíti a megtalálást)</Label>
              <Input id="street_address" value={formData.street_address} onChange={(e) => handleInputChange('street_address', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Elérhetőség és Social Media</CardTitle>
            <HelpModal helpKey="kapcsolat" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email cím *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="phone">Telefonszám (Ajánlott - közvetlen kapcsolat lehetősége)</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="website">Weboldal (Ajánlott - növeli a hitelességet)</Label>
              <Input id="website" value={formData.website} onChange={(e) => handleInputChange('website', e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="facebook_url">Facebook URL (Ajánlott - közösségi bizonyíték)</Label>
                    <Input id="facebook_url" value={formData.facebook_url} onChange={(e) => handleInputChange('facebook_url', e.target.value)} placeholder="https://facebook.com/..." />
                </div>
                <div>
                    <Label htmlFor="instagram_url">Instagram URL (Ajánlott - vizuális bemutatkozás)</Label>
                    <Input id="instagram_url" value={formData.instagram_url} onChange={(e) => handleInputChange('instagram_url', e.target.value)} placeholder="https://instagram.com/..." />
                </div>
                <div>
                    <Label htmlFor="tiktok_url">TikTok URL</Label>
                    <Input id="tiktok_url" value={formData.tiktok_url} onChange={(e) => handleInputChange('tiktok_url', e.target.value)} placeholder="https://tiktok.com/@..." />
                </div>
                <div>
                    <Label htmlFor="youtube_url">YouTube URL</Label>
                    <Input id="youtube_url" value={formData.youtube_url} onChange={(e) => handleInputChange('youtube_url', e.target.value)} placeholder="https://youtube.com/c/..." />
                </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Szolgáltatások és árazás</CardTitle>
              <HelpModal helpKey="szolgaltatasok" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label>Kínált szolgáltatások (Ajánlott - részletes lista vonzza az ügyfeleket)</Label>
                    <div className="flex gap-2">
                        <Input value={serviceInput} onChange={(e) => setServiceInput(e.target.value)} placeholder="pl. Sétáltatás" />
                        <Button type="button" onClick={handleServiceAdd}><PlusCircle className="w-4 h-4 mr-2" /> Hozzáad</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.services_offered.map(s => (
                            <Badge key={s} variant="secondary" className="flex items-center gap-1">
                                {s}
                                <button type="button" onClick={() => handleServiceRemove(s)}><X className="w-3 h-3" /></button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div>
                    <Label>Árszint (Ajánlott - segíti a célzott keresést)</Label>
                    <Select value={formData.price_level} onValueChange={(value) => handleInputChange('price_level', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="budget">Pénztárcabarát ($)</SelectItem>
                            <SelectItem value="standard">Átlagos ($$)</SelectItem>
                            <SelectItem value="premium">Prémium ($$$)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Részletes árlista (Ajánlott - átláthatóság növeli a bizalmat)</Label>
                    <div className="space-y-2">
                        {formData.pricing.map((p, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                                <Input 
                                    placeholder="Szolgáltatás neve" 
                                    value={p.service} 
                                    onChange={(e) => handlePricingChange(index, 'service', e.target.value)} 
                                    className="flex-1"
                                />
                                <div className="relative">
                                    <Input 
                                        placeholder="0" 
                                        value={p.price} 
                                        onChange={(e) => handlePricingChange(index, 'price', e.target.value)}
                                        className="w-28 pr-8" 
                                    />
                                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                                        Ft
                                    </span>
                                </div>
                                <Select 
                                    value={p.unit} 
                                    onValueChange={(value) => handlePricingChange(index, 'unit', value)}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="óra">/ óra</SelectItem>
                                        <SelectItem value="nap">/ nap</SelectItem>
                                        <SelectItem value="alkalom">/ alkalom</SelectItem>
                                        <SelectItem value="hét">/ hét</SelectItem>
                                        <SelectItem value="hónap">/ hónap</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center space-x-2 whitespace-nowrap">
                                    <Checkbox 
                                        id={`from_suffix_${index}`} 
                                        checked={p.from_suffix} 
                                        onCheckedChange={(checked) => handlePricingChange(index, 'from_suffix', checked)} 
                                    />
                                    <Label htmlFor={`from_suffix_${index}`} className="text-sm">-tól</Label>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="icon" 
                                    className="flex-shrink-0"
                                    onClick={() => removePricingRow(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addPricingRow}>
                            <PlusCircle className="w-4 h-4 mr-2" /> Új ársor
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Nyitvatartás</CardTitle>
            <HelpModal helpKey="nyitvatartas" />
          </CardHeader>
          <CardContent className="space-y-2">
              <p className="text-sm text-gray-600 mb-4">(Ajánlott - segíti az ügyfeleket a megfelelő időben keresni)</p>
              {formData.opening_hours.map((oh, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                      <Input className="w-32" value={oh.day} readOnly />
                      <Input type="time" value={oh.open} onChange={(e) => handleOpeningHoursChange(index, 'open', e.target.value)} disabled={oh.is_closed} />
                      <Input type="time" value={oh.close} onChange={(e) => handleOpeningHoursChange(index, 'close', e.target.value)} disabled={oh.is_closed} />
                      <div className="flex items-center space-x-2">
                          <Checkbox id={`is_closed_${index}`} checked={oh.is_closed} onCheckedChange={(checked) => handleOpeningHoursChange(index, 'is_closed', checked)} />
                          <Label htmlFor={`is_closed_${index}`}>Zárva</Label>
                      </div>
                  </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Képek</CardTitle>
            <HelpModal helpKey="kepek" />
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                  <Label>Profilkép vagy Logó *</Label>
                  <p className="text-sm text-gray-600 mb-2">Ez lesz a szolgáltatásod fő képe a listázásokban</p>
                  <Input type="file" onChange={(e) => handleFileUpload(e, 'main')} />
                  {isUploadingMain && <Loader2 className="w-5 h-5 animate-spin" />}
                  {formData.main_photo_url && <img src={formData.main_photo_url} alt="Profilkép" className="w-32 h-32 object-cover rounded-lg mt-2" />}
              </div>
              <div>
                  <Label>Galéria (Ajánlott - több kép nagyobb bizalmat kelt)</Label>
                  <p className="text-sm text-gray-600 mb-2">Mutasd be a helyszínt, munka közben vagy boldog állatokat</p>
                  <Input type="file" multiple onChange={(e) => handleFileUpload(e, 'gallery')} />
                  {isUploadingGallery && <Loader2 className="w-5 h-5 animate-spin" />}
                  <div className="flex flex-wrap gap-2 mt-2">
                      {formData.gallery_photos.map((photo, index) => (
                          <div key={index} className="relative">
                              <img src={photo} alt="galéria kép" className="w-24 h-24 object-cover rounded-lg" />
                              <Button type="button" size="icon" variant="destructive" className="absolute top-0 right-0 h-6 w-6" onClick={() => removeGalleryPhoto(index)}><X className="w-4 h-4" /></Button>
                          </div>
                      ))}
                  </div>
              </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
              Mégse
          </Button>
          <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Módosítások mentése' : 'Szolgáltatás mentése'}
          </Button>
        </div>
      </form>
    </div>
  );
}
