import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Globe, Facebook, Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactInfo({ provider }) {
  const today = new Date().toLocaleString('hu-HU', { weekday: 'long' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Elérhetőség</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cím */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{provider.location}, {provider.county}</div>
              {provider.street_address && (
                <div className="text-gray-600 text-sm mt-1">{provider.street_address}</div>
              )}
            </div>
          </div>

          {/* Telefon */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <a href={`tel:${provider.phone}`} className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                {provider.phone}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <a href={`mailto:${provider.email}`} className="font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                {provider.email}
              </a>
            </div>
          </div>

          {/* Nyitvatartás */}
          {provider.opening_hours && provider.opening_hours.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-grow">
                <div className="font-semibold text-gray-900 mb-3">Nyitvatartás</div>
                <div className="space-y-1">
                  {provider.opening_hours.map(item => (
                    <div key={item.day} className={`flex justify-between text-sm ${
                      item.day.toLowerCase() === today.toLowerCase() 
                        ? 'font-bold text-green-700 bg-green-50 px-2 py-1 rounded' 
                        : 'text-gray-600'
                    }`}>
                      <span>{item.day}</span>
                      <span>{item.is_closed ? 'Zárva' : `${item.open} - ${item.close}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Weboldal és Social Media */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-3">
              {provider.website && (
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  <Globe className="w-4 h-4" />
                  Weboldal
                </a>
              )}
              {provider.facebook_url && (
                <a
                  href={provider.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {provider.instagram_url && (
                <a
                  href={provider.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {provider.youtube_url && (
                <a
                  href={provider.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {provider.tiktok_url && (
                <a
                  href={provider.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-black hover:bg-gray-800 rounded-lg text-white transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.6-2.95-1.5-1.72-2.29-3.88-2.39-6.09-.21-4.74 3.42-8.62 7.82-8.62.17 0 .34 0 .5.02v3.98c-.13-.02-.26-.04-.39-.04-1.55 0-2.99.8-3.76 2.15-.78 1.34-.77 3.01.01 4.35.77 1.36 2.22 2.16 3.77 2.16 1.55 0 3-.8 3.77-2.16.52-.91.67-1.97.43-2.97-.23-.99-.79-1.89-1.57-2.53v-3.98c.16-.02.33-.02.5-.02z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}