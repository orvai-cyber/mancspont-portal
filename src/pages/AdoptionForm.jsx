
import React, { useState, useEffect } from 'react';
import { Animal } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { useLocation, Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { ArrowLeft, Upload, X, PawPrint, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { createPageUrl } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { AdoptionRequest } from '@/api/entities';
import { User } from '@/api/entities';
import { toast } from 'sonner';

export default function AdoptionFormPage() {
  const [animal, setAnimal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    introduction: '',
    homePhotos: []
  });
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [user, setUser] = useState(null);

  useEffect(() => {
    User.me().then(currentUser => {
      setUser(currentUser);
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          name: currentUser.full_name || '',
          email: currentUser.email || ''
        }));
      }
    }).catch(() => setUser(null));

    const loadAnimalData = async () => {
      setIsLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const animalId = searchParams.get('animalId');
      
      if (animalId) {
        try {
          const fetchedAnimal = await Animal.get(animalId);
          setAnimal(fetchedAnimal);
        } catch (error) {
          console.error('Error loading animal:', error);
          toast.error("Hiba történt az állat adatainak betöltésekor.");
        }
      }
      setIsLoading(false);
    };

    loadAnimalData();
  }, [location]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (files) => {
    setUploadingFiles(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const result = await UploadFile({ file });
        return result.file_url;
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error("Hiba történt egy fájl feltöltésekor.");
        return null;
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter(url => url !== null);
    
    setFormData(prev => ({
      ...prev,
      homePhotos: [...prev.homePhotos, ...validUrls]
    }));
    setUploadingFiles(false);
  };

  const removePhoto = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      homePhotos: prev.homePhotos.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Örökbefogadási kérelem elküldése elkezdődött');
    
    if (!user) {
      console.log('❌ Nincs bejelentkezett felhasználó');
      await User.loginWithRedirect(window.location.href); // Changed logic as per outline
      return;
    }

    if (!animal) {
      console.log('❌ Nincs állat adat');
      toast.error("Hiányzó adatok", {
        description: "Állat adatok nem találhatók!",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData = {
        animal_id: animal.id,
        animal_name: animal.name,
        shelter_name: animal.shelter_name,
        user_id: user.id,
        user_name: formData.name, // Using formData for name, as it can be edited even if pre-filled
        user_email: formData.email, // Using formData for email, as it can be edited even if pre-filled
        user_phone: formData.phone,
        user_address: formData.address,
        introduction: formData.introduction,
        home_photos: formData.homePhotos,
        status: 'beérkezett',
        user_has_seen_update: true, // Added as per outline
        admin_has_seen: false // Added as per outline
      };

      console.log('📝 Mentendő kérelem adatok:', requestData);
      console.log('🏠 Menhely neve az állatnál:', animal.shelter_name);
      
      const newRequest = await AdoptionRequest.create(requestData);
      console.log('✅ Kérelem sikeresen elmentve:', newRequest);
      
      toast.success("Sikeres jelentkezés!", { // Updated toast message as per outline
        description: "Örökbefogadási kérelem sikeresen elküldve!",
      });
      
      navigate(createPageUrl("UserAdoptions")); // Changed navigation as per outline
      
    } catch (error) {
      console.error('❌ Hiba az örökbefogadási kérelem mentésekor:', error);
      console.log('❌ Hiba részletei:', error.message, error.response?.data);
      toast.error('Hiba történt', { // Updated toast message as per outline
        description: 'Nem sikerült elküldeni a kérelmet: Kérjük próbáld újra.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-32 w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <PawPrint className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Állat nem található</h2>
        <Link to={createPageUrl('Animals')}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Vissza az állatokhoz
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl(`AnimalDetails?id=${animal.id}`)}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Örökbefogadási jelentkezés</h1>
            <p className="text-gray-600">Jelentkezés {animal.name} örökbefogadására</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PawPrint className="w-5 h-5 text-green-600" />
                  {animal.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img 
                  src={animal.photos[0]} 
                  alt={animal.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Faj:</span>
                    <span className="font-semibold capitalize">{animal.species}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fajta:</span>
                    <span className="font-semibold">{animal.breed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Méret:</span>
                    <span className="font-semibold capitalize">{animal.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nem:</span>
                    <span className="font-semibold capitalize">{animal.gender}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">Tulajdonságok</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Oltott:</span>
                      <Badge variant={animal.vaccinated ? "default" : "secondary"}>
                        {animal.vaccinated ? "Igen" : "Nem"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Chippelt:</span>
                      <Badge variant={animal.microchipped ? "default" : "secondary"}>
                        {animal.microchipped ? "Igen" : "Nem"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ivartalanított:</span>
                      <Badge variant={animal.sterilized ? "default" : "secondary"}>
                        {animal.sterilized ? "Igen" : "Nem"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {animal.personality && animal.personality.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold mb-3">Személyiség</h4>
                    <div className="flex flex-wrap gap-2">
                      {animal.personality.map(trait => (
                        <Badge key={trait} variant="outline" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Örökbefogadói adatok</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teljes név *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Pl. Nagy János"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email cím *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="pl@email.hu"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefonszám *
                      </label>
                      <Input
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+36 30 123 4567"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cím (ahova {animal.name} kerül) *
                      </label>
                      <Input
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="1234 Budapest, Példa utca 12."
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bemutatkozás *
                    </label>
                    <Textarea
                      required
                      value={formData.introduction}
                      onChange={(e) => handleInputChange('introduction', e.target.value)}
                      placeholder="Beszélj magadról, a családodról, állattartási tapasztalataidról, miért szeretnéd örökbe fogadni ezt az állatot..."
                      className="h-32"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Képek az új otthonról
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Oszd meg velünk néhány képen, milyen környezetben fog élni {animal.name}!
                    </p>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="photo-upload"
                        disabled={uploadingFiles || isSubmitting}
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700">
                          {uploadingFiles ? 'Feltöltés folyamatban...' : 'Kattints ide képek feltöltéséhez'}
                        </p>
                        <p className="text-sm text-gray-500">vagy húzd ide a fájlokat</p>
                      </label>
                    </div>

                    {formData.homePhotos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {formData.homePhotos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={photo} 
                              alt={`Otthon ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                              disabled={isSubmitting}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Mi történik ezután?</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• A menhely munkatársai átnézik a jelentkezésedet</li>
                      <li>• Telefonon vagy emailben felveszik veled a kapcsolatot</li>
                      <li>• Személyes találkozó szervezése {animal.name}-val</li>
                      <li>• Ha minden rendben, örökbefogadási szerződés aláírása</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Jelentkezés beküldése...' : 'Jelentkezés beküldése'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
