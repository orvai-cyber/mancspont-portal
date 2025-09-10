
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Upload, 
  X, 
  Plus, 
  Clock,
  MapPin, // MapPin is already imported
  Users,
  DollarSign,
  Camera,
  Calendar,
  FileText,
  Save // Added Save icon
} from 'lucide-react';
import { UploadFile } from '@/api/integrations';

const eventTypes = [
  { value: 'orokbefogado_nap', label: 'Örökbefogadó nap' },
  { value: 'jotekonysagi_esemeny', label: 'Jótékonysági esemény' },
  { value: 'oktato_program', label: 'Oktató program' },
  { value: 'kozossegi_talalkozo', label: 'Közösségi találkozó' },
];

// Added countyOptions array
const countyOptions = [
  'Budapest',
  'Bács-Kiskun',
  'Baranya',
  'Békés',
  'Borsod-Abaúj-Zemplén',
  'Csongrád-Csanád',
  'Fejér',
  'Győr-Moson-Sopron',
  'Hajdú-Bihar',
  'Heves',
  'Jász-Nagykun-Szolnok',
  'Komárom-Esztergom',
  'Nógrád',
  'Pest',
  'Somogy',
  'Szabolcs-Szatmár-Bereg',
  'Tolna',
  'Vas',
  'Veszprém',
  'Zala'
];

export default function EventForm({ initialData, shelterName, onSubmit, onCancel, isLoading }) {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '10:00',
    end_time: '16:00',
    location: '',
    county: '', // Added county to initial state
    organizer: shelterName,
    organizer_phone: '',
    organizer_email: '',
    event_type: 'orokbefogado_nap',
    max_participants: 0,
    photo_url: '',
    gallery_photos: [],
    registration_required: false,
    entry_fee: 0,
    parking_info: 'Ingyenes parkolás a helyszínen',
    program: '',
    program_schedule: [],
    bring_items: ['Személyazonosító okmány', 'Jó hangulat'],
    event_website: '',
    facebook_event: '',
    ticket_link: '',
    ...initialData,
  });
  
  const [isUploading, setIsUploading] = useState({
    cover: false,
    gallery: false
  });
  
  const [useSchedule, setUseSchedule] = useState(false);
  const [newScheduleItem, setNewScheduleItem] = useState({ time: '', activity: '', description: '' });
  const [newBringItem, setNewBringItem] = useState('');

  useEffect(() => {
    if (initialData) {
      setEventData(prev => ({ 
        ...prev, // Keep existing state if initialData doesn't override it
        ...initialData, 
        gallery_photos: initialData.gallery_photos || [],
        program_schedule: initialData.program_schedule || [],
        bring_items: initialData.bring_items || ['Személyazonosító okmány', 'Jó hangulat']
      }));
      setUseSchedule(initialData.program_schedule?.length > 0);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSwitchChange = (name, checked) => {
    setEventData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(prev => ({ ...prev, [type]: true }));
    try {
      if (type === 'gallery') {
        const uploadPromises = files.map(file => UploadFile({ file }));
        const uploadResults = await Promise.all(uploadPromises);
        const newPhotos = uploadResults.map(result => result.file_url);
        
        setEventData(prev => ({
          ...prev,
          gallery_photos: [...prev.gallery_photos, ...newPhotos]
        }));
      } else {
        const { file_url } = await UploadFile({ file: files[0] });
        setEventData(prev => ({
          ...prev,
          photo_url: file_url
        }));
      }
    } catch (error) {
      console.error('Hiba a fájl feltöltésekor:', error);
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const removeGalleryPhoto = (index) => {
    setEventData(prev => ({
      ...prev,
      gallery_photos: prev.gallery_photos.filter((_, i) => i !== index)
    }));
  };

  const addScheduleItem = () => {
    if (newScheduleItem.time && newScheduleItem.activity) {
      setEventData(prev => ({
        ...prev,
        program_schedule: [...prev.program_schedule, newScheduleItem]
      }));
      setNewScheduleItem({ time: '', activity: '', description: '' });
    }
  };

  const removeScheduleItem = (index) => {
    setEventData(prev => ({
      ...prev,
      program_schedule: prev.program_schedule.filter((_, i) => i !== index)
    }));
  };

  const addBringItem = () => {
    if (newBringItem.trim()) {
      setEventData(prev => ({
        ...prev,
        bring_items: [...prev.bring_items, newBringItem.trim()]
      }));
      setNewBringItem('');
    }
  };

  const removeBringItem = (index) => {
    setEventData(prev => ({
      ...prev,
      bring_items: prev.bring_items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...eventData,
      program_schedule: useSchedule ? eventData.program_schedule : []
    };
    onSubmit(dataToSubmit);
  };

  const isEditMode = !!initialData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? `"${eventData.title}" szerkesztése` : "Új esemény létrehozása"}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? "Módosítsd az esemény részleteit." : "Hozz létre egy új eseményt a menhelyed számára."}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onCancel}>
          Mégse
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Alapadatok */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Alapvető információk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Esemény címe *</Label>
                  <Input id="title" name="title" value={eventData.title} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="event_type">Esemény típusa *</Label>
                  <Select value={eventData.event_type} onValueChange={(value) => setEventData(prev => ({...prev, event_type: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Helyszín *</Label>
                  <Input id="location" name="location" value={eventData.location} onChange={handleChange} required />
                </div>
                {/* Added county select field */}
                <div>
                  <Label htmlFor="county">Vármegye *</Label>
                  <Select value={eventData.county} onValueChange={(value) => setEventData(prev => ({...prev, county: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Válassz vármegyét" />
                    </SelectTrigger>
                    <SelectContent>
                      {countyOptions.map(county => (
                        <SelectItem key={county} value={county}>{county}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="date">Dátum *</Label>
                    <Input id="date" name="date" type="date" value={eventData.date} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="start_time">Kezdés</Label>
                    <Input id="start_time" name="start_time" type="time" value={eventData.start_time} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="end_time">Befejezés</Label>
                    <Input id="end_time" name="end_time" type="time" value={eventData.end_time} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Leírás</Label>
                  <Textarea id="description" name="description" value={eventData.description} onChange={handleChange} rows={6} />
                </div>
                <div>
                  <Label htmlFor="max_participants">Max. résztvevők (0 = korlátlan)</Label>
                  <Input id="max_participants" name="max_participants" type="number" value={eventData.max_participants} onChange={handleChange} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Képek */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Borító és galéria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Borító */}
            <div>
              <Label>Borító fotó</Label>
              <div className="space-y-2">
                {eventData.photo_url && (
                  <div className="relative inline-block">
                    <img src={eventData.photo_url} alt="Borító" className="w-full h-40 object-cover rounded border" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setEventData(prev => ({ ...prev, photo_url: '' }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'cover')}
                    className="hidden"
                    id="cover-upload"
                  />
                  <Label htmlFor="cover-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        {isUploading.cover ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        Borító feltöltése
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>
            </div>

            {/* Galéria */}
            <div>
              <Label>Esemény fotógaléria</Label>
              <div className="space-y-4">
                {eventData.gallery_photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {eventData.gallery_photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img src={photo} alt={`Galéria ${index + 1}`} className="w-full h-24 object-cover rounded border" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeGalleryPhoto(index)}
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
                    onChange={(e) => handleFileUpload(e, 'gallery')}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <Label htmlFor="gallery-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        {isUploading.gallery ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Képek hozzáadása
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={useSchedule} 
                onCheckedChange={setUseSchedule}
                id="use-schedule"
              />
              <Label htmlFor="use-schedule">Részletes időbeosztás használata</Label>
            </div>

            {useSchedule ? (
              <div className="space-y-4">
                {eventData.program_schedule.length > 0 && (
                  <div className="space-y-2">
                    {eventData.program_schedule.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Badge variant="outline">{item.time}</Badge>
                        <div className="flex-grow">
                          <p className="font-medium">{item.activity}</p>
                          {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeScheduleItem(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Input
                    type="time"
                    placeholder="Időpont"
                    value={newScheduleItem.time}
                    onChange={(e) => setNewScheduleItem(prev => ({...prev, time: e.target.value}))}
                  />
                  <Input
                    placeholder="Tevékenység"
                    value={newScheduleItem.activity}
                    onChange={(e) => setNewScheduleItem(prev => ({...prev, activity: e.target.value}))}
                  />
                  <Input
                    placeholder="Leírás (opcionális)"
                    value={newScheduleItem.description}
                    onChange={(e) => setNewScheduleItem(prev => ({...prev, description: e.target.value}))}
                  />
                  <Button type="button" onClick={addScheduleItem} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="program">Program leírása</Label>
                <Textarea 
                  id="program" 
                  name="program" 
                  value={eventData.program} 
                  onChange={handleChange} 
                  rows={4} 
                  placeholder="Írd le az esemény programját..."
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fontos információk */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Fontos információk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entry_fee">Belépő ár (Ft) - 0 = ingyenes</Label>
                  <Input id="entry_fee" name="entry_fee" type="number" value={eventData.entry_fee} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="registration_required" 
                    checked={eventData.registration_required}
                    onCheckedChange={(checked) => handleSwitchChange('registration_required', checked)}
                  />
                  <Label htmlFor="registration_required">Regisztráció szükséges</Label>
                </div>
                <div>
                  <Label htmlFor="parking_info">Parkolási információk</Label>
                  <Input id="parking_info" name="parking_info" value={eventData.parking_info} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="organizer_phone">Szervező telefonszáma</Label>
                  <Input id="organizer_phone" name="organizer_phone" value={eventData.organizer_phone} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="organizer_email">Szervező email címe</Label>
                  <Input id="organizer_email" name="organizer_email" type="email" value={eventData.organizer_email} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Mit hozz magaddal */}
            <div>
              <Label>Mit hozz magaddal</Label>
              <div className="space-y-2">
                {eventData.bring_items.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {eventData.bring_items.map((item, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {item}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeBringItem(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    placeholder="Új elem hozzáadása..."
                    value={newBringItem}
                    onChange={(e) => setNewBringItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBringItem())}
                  />
                  <Button type="button" onClick={addBringItem} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Linkek és további információk */}
        <Card>
          <CardHeader>
            <CardTitle>Online jelenlét</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="event_website">Esemény webhelye</Label>
              <Input id="event_website" name="event_website" value={eventData.event_website} onChange={handleChange} placeholder="https://..." />
            </div>
            <div>
              <Label htmlFor="facebook_event">Facebook esemény</Label>
              <Input id="facebook_event" name="facebook_event" value={eventData.facebook_event} onChange={handleChange} placeholder="https://facebook.com/events/..." />
            </div>
            <div>
              <Label htmlFor="ticket_link">Jegyvásárlási link</Label>
              <Input id="ticket_link" name="ticket_link" value={eventData.ticket_link} onChange={handleChange} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        {/* Mentés gomb */}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Mégse
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEditMode ? "Módosítások mentése" : "Esemény létrehozása"}
          </Button>
        </div>
      </form>
    </div>
  );
}
