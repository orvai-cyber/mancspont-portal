
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Building, Wrench, Mail, Lock, Phone, Chrome, ArrowRight, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Belső komponens a bejelentkezési formhoz
const LoginForm = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="login-email">Email cím</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input id="login-email" type="email" placeholder="pelda@email.com" className="pl-10 focus:placeholder:text-transparent" />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="login-password">Jelszó</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input id="login-password" type="password" placeholder="••••••••" className="pl-10 focus:placeholder:text-transparent" />
      </div>
    </div>
    <div className="text-right">
      <a href="#" className="text-sm text-blue-600 hover:underline">Elfelejtetted a jelszavad?</a>
    </div>
    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">Bejelentkezés</Button>
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-gray-500">Vagy</span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline"><Chrome className="w-4 h-4 mr-2" /> Google</Button>
      <Button variant="outline">Facebook</Button>
    </div>
  </div>
);

// Belső komponens a regisztrációs formokhoz
const RegistrationForms = ({ defaultSubTab }) => {
  const serviceOptions = ["Kutyapanzió", "Kutyanapközi", "Kutyaiskola", "Kutyaszitter"];

  return (
    <Tabs defaultValue={defaultSubTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-50 h-14 p-1 rounded-lg">
        <TabsTrigger 
          value="user" 
          className="h-full text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-lg data-[state=active]:font-semibold rounded-md transition-all duration-200 text-gray-600 font-medium"
        >
          <User className="w-4 h-4 mr-1 sm:mr-2" />
          Felhasználó
        </TabsTrigger>
        <TabsTrigger 
          value="shelter" 
          className="h-full text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-lg data-[state=active]:font-semibold rounded-md transition-all duration-200 text-gray-600 font-medium"
        >
          <Building className="w-4 h-4 mr-1 sm:mr-2" />
          Menhely
        </TabsTrigger>
        <TabsTrigger 
          value="provider" 
          className="h-full text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-lg data-[state=active]:font-semibold rounded-md transition-all duration-200 text-gray-600 font-medium"
        >
          <Wrench className="w-4 h-4 mr-1 sm:mr-2" />
          Szolgáltató
        </TabsTrigger>
      </TabsList>

      <div className="pt-6">
        <TabsContent value="user" className="mt-0">
          {/* Felhasználó regisztráció */}
          <div className="space-y-4">
             <h3 className="font-semibold text-center text-gray-700">Regisztráció gazdiként</h3>
             <LoginForm />
          </div>
        </TabsContent>
        <TabsContent value="shelter" className="mt-0">
          {/* Menhely regisztráció */}
          <div className="space-y-4">
            <h3 className="font-semibold text-center text-gray-700">Regisztráció menhelyként</h3>
            <div className="space-y-2">
              <Label htmlFor="shelter-name">Menhely neve</Label>
              <Input id="shelter-name" placeholder="Mancs Menedék" className="focus:placeholder:text-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shelter-email">Email</Label>
              <Input id="shelter-email" type="email" placeholder="info@mancsmenedek.hu" className="focus:placeholder:text-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shelter-contact-name">Kapcsolattartó neve</Label>
              <Input id="shelter-contact-name" placeholder="Nagy Anna" className="focus:placeholder:text-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shelter-phone">Telefonszám</Label>
              <Input id="shelter-phone" type="tel" placeholder="+36 30 123 4567" className="focus:placeholder:text-transparent" />
            </div>
            <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600">Regisztráció</Button>
          </div>
        </TabsContent>
        <TabsContent value="provider" className="mt-0">
          {/* Szolgáltató regisztráció */}
          <div className="space-y-4">
            <h3 className="font-semibold text-center text-gray-700">Regisztráció szolgáltatóként</h3>
            <div className="space-y-2">
              <Label htmlFor="provider-name">Szolgáltató neve</Label>
              <Input id="provider-name" placeholder="Kutya Wellness Kft." className="focus:placeholder:text-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-email">Email</Label>
              <Input id="provider-email" type="email" placeholder="info@kutyawellness.hu" className="focus:placeholder:text-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-contact-name">Kapcsolattartó neve</Label>
              <Input id="provider-contact-name" placeholder="Kiss Géza" className="focus:placeholder:text-transparent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-phone">Telefonszám</Label>
              <Input id="provider-phone" type="tel" placeholder="+36 70 987 6543" className="focus:placeholder:text-transparent" />
            </div>
            <div className="space-y-2">
              <Label>Szolgáltatás típusa</Label>
              <RadioGroup defaultValue={serviceOptions[0]} className="grid grid-cols-2 gap-4 pt-2">
                {serviceOptions.map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <RadioGroupItem value={service} id={service} />
                    <Label htmlFor={service} className="font-normal">{service}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600">Regisztráció</Button>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default function AuthModal({ isOpen, onClose, defaultTab = 'register', defaultSubTab = 'user' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent 
            className="sm:max-w-2xl p-0 overflow-hidden border-0" 
            as={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Bal oldali design elem */}
              <div className="hidden md:block bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 p-8 text-white relative overflow-hidden">
                 <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-white/10 rounded-full"></div>
                 <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full"></div>
                 <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <h2 className="text-2xl font-bold">Üdv a MancsPont közösségében!</h2>
                      <p className="mt-2 text-green-100">Együtt otthont adhatunk minden állatnak.</p>
                    </div>
                    <div className="mt-8">
                       <div className="flex items-center gap-3 p-4 bg-white/20 rounded-lg backdrop-blur-sm">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-red-500" />
                          </div>
                          <div>
                            <p className="font-bold">Ments meg egy életet</p>
                            <p className="text-sm opacity-80">Fogadj örökbe!</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Jobb oldali tartalom */}
              <div className="p-8">
                <Tabs defaultValue={defaultTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-50 h-12 p-1 rounded-lg">
                    <TabsTrigger 
                      value="login" 
                      className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-lg data-[state=active]:font-semibold rounded-md transition-all duration-200 text-gray-600 font-medium"
                    >
                      Bejelentkezés
                    </TabsTrigger>
                    <TabsTrigger 
                      value="register" 
                      className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-lg data-[state=active]:font-semibold rounded-md transition-all duration-200 text-gray-600 font-medium"
                    >
                      Regisztráció
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="pt-6">
                    <LoginForm />
                  </TabsContent>
                  <TabsContent value="register" className="pt-6">
                    <RegistrationForms defaultSubTab={defaultSubTab} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
