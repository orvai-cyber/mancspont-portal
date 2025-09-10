
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Building, 
  ArrowRight, 
  Search, 
  PawPrint, 
  MessageSquare, 
  TrendingUp,
  Home,
  Sun,
  GraduationCap,
  Heart,
  PenTool,
  Handshake,
  Calendar,
  CheckCircle,
  Users,
  Mail,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceProviderApplicationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    services: [],
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleServiceChange = (service, checked) => {
    if (checked) {
      setFormData(prev => ({ ...prev, services: [...prev.services, service] }));
    } else {
      setFormData(prev => ({ ...prev, services: prev.services.filter(s => s !== service) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', services: [], message: '' });
    }, 3000);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Building className="w-8 h-8 text-purple-600" />
                <span className="text-sm font-medium text-purple-600 uppercase tracking-wide">Szolgáltatók</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Csatlakozz a legnagyobb állatos portál szolgáltatói közösségéhez
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Egy helyen találkoznak a gazdik és a szolgáltatók – panziók, napközik, kutyaiskolák és szitterek. 
                Mi összekötünk, hogy neked ne kelljen külön hirdetésekre költened.
              </p>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
              >
                <Building className="w-5 h-5 mr-2" />
                Jelentkezz szolgáltatónak
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-2xl shadow-2xl">
                <h3 className="text-lg font-bold mb-4">Szolgáltatók keresése</h3>
                <div className="space-y-3">
                  {[
                    { name: "Happy Tails Panzió", type: "Kutyapanzió", rating: 4.9 },
                    { name: "Kutya Akadémia", type: "Kutyaiskola", rating: 4.8 },
                    { name: "Sunny Days Napközi", type: "Napközi", rating: 4.7 }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                        <PawPrint className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 text-sm">★ {item.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Egy átfogó portál, ahol minden egy helyen van
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Nem kell külön hirdetned, nem kell új csatornákat keresned. Mi összehozzuk a gazdikat és a szolgáltatókat egy közös felületen, 
              ahol minden egyszerűbb, gyorsabb és átláthatóbb. Nálunk egy regisztrációval bekerülsz egy közösségbe, 
              ahol a gazdik aktívan keresnek panziót, napközit, iskolát vagy szittert.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Search, title: "Könnyű megtalálhatóság", desc: "A gazdik könnyedén rád találnak keresési kategóriák és szűrők segítségével" },
              { icon: PawPrint, title: "Célzott közönség", desc: "Csak olyan látogatók, akik aktívan keresnek szolgáltatást kedvenceiknek" },
              { icon: MessageSquare, title: "Közvetlen kapcsolat", desc: "Beépített üzenetküldő rendszer a gyors és biztonságos kommunikációhoz" },
              { icon: TrendingUp, title: "Növekvő láthatóság", desc: "Egyre több gazdi látogat el hozzánk, növelve az esélyed új ügyfelekre" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Egyszerű csatlakozás, átlátható folyamat
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Regisztráció", desc: "Töltsd ki az alábbi űrlapot és küldd el nekünk az adataidat" },
              { step: "2", title: "Adatok kitöltése", desc: "Add meg az alapvető adataidat a szolgáltatásodról" },
              { step: "3", title: "Profil kitöltése", desc: "A szolgáltatói admin felületen töltsd ki a bemutatkozást" },
              { step: "4", title: "Kapcsolatfelvétel", desc: "Csapatunk rövid időn belül felveszi veled a kapcsolatot" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="h-full border-2 border-purple-100 hover:border-purple-300 transition-colors duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-purple-200 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Free for Shelters Section - MOVED HERE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-green-50 to-teal-50 text-center p-8 lg:p-12 rounded-3xl border border-green-200 shadow-sm">
              <div className="inline-block p-4 bg-white rounded-2xl mb-6 shadow-md">
                <Heart className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                A menhelyek és állatvédő egyesületek számára minden szolgáltatásunk{' '}
                <span 
                  className="text-green-600"
                >
                  INGYENES!
                </span>
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Portálunk elsődleges célja az állatok védelme és a menhelyek támogatása. Ezért számukra minden megjelenés – 
                beleértve a PR cikkeket is – teljesen díjmentes. Ez a mi hozzájárulásunk ahhoz, 
                hogy minél több állat találjon biztonságos otthonra.
              </p>
            </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Szolgáltatói megjelenési csomagok
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ha te is kutyás szolgáltató vagy, itt a helyed. Válaszd ki a kategóriád, és csatlakozz a közösséghez.
            </p>
          </div>

          {/* AKCIÓS BLOKK - MOVED HERE */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-300/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-red-400/10 rounded-full blur-xl"></div>
              </div>
              
              <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-red-700 uppercase tracking-wide">Korlátozott idejű ajánlat</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    🎉 Különleges <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">indulási ajánlat</span>
                  </h2>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
                    <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-4">
                      Most különleges lehetőséget kínálunk: minden szolgáltató számára az 
                      <strong className="text-orange-600"> alap megjelenés teljesen ingyenes az első évben</strong>, 
                      ha <strong className="text-red-600">2025. október 15-ig</strong> regisztrál.
                    </p>
                    
                    <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500">
                      <p className="text-gray-700 leading-relaxed">
                        <strong>Csupán annyit kérünk</strong>, hogy a weboldalad láblécében helyezd el a logónkat egy követő linkkel.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-2xl font-bold">0</span>
                      </div>
                      <h3 className="font-bold text-gray-900">Költség</h3>
                      <p className="text-sm text-gray-600">Első évben teljesen ingyenes</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-xs font-bold">LINK</span>
                      </div>
                      <h3 className="font-bold text-gray-900">Egyetlen feltétel</h3>
                      <p className="text-sm text-gray-600">Logo elhelyezése láblécben</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-xl">∞</span>
                      </div>
                      <h3 className="font-bold text-gray-900">Teljes hozzáférés</h3>
                      <p className="text-sm text-gray-600">Minden alap funkció elérhető</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[280px]"
                      onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                    >
                      🚀 Jelentkezem most az akcióra!
                    </Button>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Akció vége:</div>
                      <div className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
                        2025. október 15.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Home,
                title: "Kutyapanzióknak",
                desc: "Ha te vagy az, aki biztonságos otthont nyújt a gazdik kedvenceinek, amíg ők távol vannak, akkor nálunk könnyen rád találnak.",
                price: "58.000 Ft + áfa / év",
                bgColor: "from-blue-400/20 to-blue-500/30",
                iconColor: "bg-blue-500 text-white"
              },
              {
                icon: Sun,
                title: "Kutyanapköziknek",
                desc: "Ha te gondoskodsz a kutyákról napközben, miközben a gazdik dolgoznak, akkor itt a helyed – mi összekötünk azokkal, akik épp ezt keresik.",
                price: "58.000 Ft + áfa / év",
                bgColor: "from-orange-400/20 to-orange-500/30",
                iconColor: "bg-orange-500 text-white"
              },
              {
                icon: GraduationCap,
                title: "Kutyaiskoláknak",
                desc: "Ha te tanítod és neveled a kutyákat, segítesz a gazdiknak, hogy jobban értsék kedvencüket, akkor nálunk bemutathatod a tudásod.",
                price: "58.000 Ft + áfa / év",
                bgColor: "from-purple-400/20 to-purple-500/30",
                iconColor: "bg-purple-500 text-white"
              },
              {
                icon: Heart,
                title: "Szittereknek",
                desc: "Ha te vagy az, aki gondoskodik a kutyáról, amikor a gazdi nem ér rá, akkor nálunk könnyen rád találhatnak azok, akiknek a legfontosabb a törődés.",
                price: "18.000 Ft + áfa / év",
                bgColor: "from-pink-400/20 to-pink-500/30",
                iconColor: "bg-pink-500 text-white"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${service.bgColor} backdrop-blur-sm border border-white/20 p-6 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 h-full flex flex-col`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${service.iconColor} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 flex-grow ml-3">{service.title}</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow">{service.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-sm text-gray-600 font-semibold">{service.price}</div>
                  <Button 
                    size="sm" 
                    className="bg-white/80 text-gray-800 hover:bg-white hover:shadow-md transition-all duration-200"
                    onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Érdekel
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services - UPDATED DESIGN */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Emeld ki magad a tömegből
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Alapmegjelenésed mellé választhatsz extra lehetőségeket is, hogy még jobban láthatóvá válj a gazdik számára.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: PenTool,
                title: "PR cikk",
                desc: "Egyedi tartalom, ami bármeddig fent marad. Saját termékedet, szolgáltatásodat vagy márkádat mutathatod be – ráadásul kimenő linket is elhelyezhetsz benne, ami SEO szempontból is előnyös.",
                price: "25.000 Ft + áfa / cikk",
                iconColor: "bg-yellow-100 text-yellow-600"
              },
              {
                icon: Handshake,
                title: "Támogatói partner",
                desc: "Légy kiemelt támogató! A főoldalunkon logóval és linkkel jelenünk meg, így márkád folyamatosan szem előtt lesz a gazdik és állatbarátok körében.",
                price: "45.000 Ft + áfa / év",
                iconColor: "bg-green-100 text-green-600"
              },
              {
                icon: Calendar,
                title: "Esemény megjelenés",
                desc: "Ha eseményt szervezel, nálunk helyet kap az eseménynaptárban, hogy a közönséged könnyen rátaláljon. Akár örökbefogadó nap, akár workshop vagy jótékonysági rendezvény.",
                price: "6.000 Ft + áfa / esemény",
                iconColor: "bg-indigo-100 text-indigo-600"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group h-full"
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  <div className={`w-16 h-16 ${service.iconColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{service.desc}</p>
                  <div className="text-sm text-gray-500 mb-6">{service.price}</div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-auto border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300"
                    onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Érdekel
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Csatlakozz, és légy részese az állatbarát közösségnek szolgáltatóként
          </h2>
          <Button 
            size="lg" 
            className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
          >
            <Building className="w-5 h-5 mr-2" />
            Jelentkezem szolgáltatónak
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Kérdésed van? Vedd fel velünk a kapcsolatot!
              </h2>
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-900 mb-2">Köszönjük!</h3>
                  <p className="text-green-800">Hamarosan felvesszük veled a kapcsolatot.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Név *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full h-12 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Az Ön neve"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full h-12 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefonszám
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full h-12 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                      placeholder="+36 30 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Mely szolgáltatások érdekelnek? (több választható)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Kutyapanzió", "Napközi", "Kutyaiskola", "Szitter", 
                        "Támogató partner", "PR cikk", "Esemény"
                      ].map(service => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={service}
                            checked={formData.services.includes(service)}
                            onCheckedChange={(checked) => handleServiceChange(service, checked)}
                            className="border-gray-300"
                          />
                          <label
                            htmlFor={service}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Miben segíthetünk?
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                      rows={4}
                      placeholder="Írja le, hogyan segíthetünk Önnek..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Üzenet küldése
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              )}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-2xl">
                <div className="text-center">
                  <Users className="w-24 h-24 text-purple-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Csatlakozz hozzánk!
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Több mint 50.000 állatbarát gazdi vár rád. Légy részese Magyarország legnagyobb 
                    állatbarát közösségének, és segíts a gazdiknak megtalálni a tökéletes szolgáltatást.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
