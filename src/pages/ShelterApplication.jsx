
import React, { useState } from 'react';
import { 
  Heart, ShieldCheck, PawPrint, Calendar, MessageSquare, CheckCircle,
  User, Mail, Phone, ArrowRight, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import AuthModal from '../components/auth/AuthModal';

export default function ShelterApplicationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 5000);
  };
  
  const benefits = [
    { icon: PawPrint, title: "Állatok bemutatása", desc: "Korlátlan számú állat adatlapját hozhatod létre képekkel, videókkal." },
    { icon: Calendar, title: "Események szervezése", desc: "Tedd közzé örökbefogadó napjaidat és egyéb rendezvényeidet." },
    { icon: Heart, title: "Adománygyűjtés", desc: "A profilodon keresztül közvetlen támogatásokat fogadhatsz." },
    { icon: MessageSquare, title: "PR lehetőség", desc: "Ingyenesen publikálhatsz cikkeket a blogunkban, növelve a láthatóságod." }
  ];
  
  const steps = [
    { step: "1", title: "Regisztrálj", desc: "Hozz létre egy felhasználói fiókot, majd válaszd a 'Menhely vagyok' opciót." },
    { step: "2", title: "Töltsd ki a profilod", desc: "Add meg a menhelyed alapadatait, tölts fel logót és bemutatkozást." },
    { step: "3", title: "Várj a jóváhagyásra", desc: "Csapatunk ellenőrzi az adataidat, hogy biztosítsuk a portál megbízhatóságát." },
    { step: "4", title: "Kezdd el a munkát", desc: "Töltsd fel az állatokat, eseményeket és oszd meg a híreidet a közösséggel!" }
  ];

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultTab="register" defaultSubTab="shelter" />
      <div className="bg-white text-gray-800">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-40 h-40 bg-green-200/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block p-4 bg-white rounded-2xl mb-6 shadow-md">
                <Heart className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Csatlakozz partner menhelyként – teljesen ingyen
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Portálunk elsődleges célja az állatok védelme és a menhelyek támogatása. Ezért számodra minden szolgáltatás ingyenes – örökre.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Regisztrálok menhelyként
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Együtt könnyebb otthont találni
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Portálunk összeköti a gazdikat a menhelyekkel, hogy minden állat könnyebben megtalálja szerető otthonát. Menhelyként nálunk bemutathatod az örökbefogadásra váró állataidat, hírt adhatsz eseményekről, támogatásokat gyűjthetsz közvetlenül, és minden megjelenésed teljesen díjmentes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-10 h-10 text-green-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Egyszerű regisztráció, azonnali megjelenés
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-2 border-gray-200 hover:border-green-300 transition-colors duration-300 shadow-sm hover:shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                        {item.step}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Free Section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white text-center p-8 lg:p-12 rounded-3xl shadow-xl">
              <ShieldCheck className="w-16 h-16 mx-auto mb-6" />
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Minden menhely számára 100% ingyenes
              </h3>
              <p className="text-lg text-green-100 leading-relaxed max-w-3xl mx-auto">
                A portálon minden menhely és állatvédő egyesület teljes körűen ingyen jelenhet meg. Ez magában foglalja az állatlistázást, események megjelenítését, sőt még a PR cikkeket is. Ez a mi hozzájárulásunk ahhoz, hogy minél több állat találjon szerető otthonra.
              </p>
            </div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Building className="w-12 h-12 text-blue-600 mx-auto mb-4"/>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ne maradj ki – csatlakozz most, és tedd láthatóvá a menhelyed a gazdik számára.
            </h2>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Regisztrálok menhelyként
            </Button>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section id="contact-form" className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Kérdésed van?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Ha bármi kérdésed felmerülne a regisztrációval kapcsolatban, vedd fel velünk a kapcsolatot az alábbi űrlap segítségével.
              </p>
            </div>
            
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-6 text-center"
              >
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900 mb-2">Köszönjük üzeneted!</h3>
                <p className="text-green-800">Munkatársunk hamarosan felveszi veled a kapcsolatot.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Név *</label>
                  <Input required value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="h-12" placeholder="Menhely neve vagy kapcsolattartó"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <Input type="email" required value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} className="h-12" placeholder="email@menhely.hu"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefonszám</label>
                    <Input type="tel" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} className="h-12" placeholder="+36 30 123 4567"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Üzenet</label>
                  <Textarea value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} rows={4} placeholder="Írd le a kérdésed..."/>
                </div>
                <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3">
                  <Mail className="w-5 h-5 mr-2" />
                  Üzenet küldése
                </Button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
