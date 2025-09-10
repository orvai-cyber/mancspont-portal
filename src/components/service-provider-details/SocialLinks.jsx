import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Globe, Facebook, Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialLinks({ provider }) {
    const hasSocialLinks = provider.phone || provider.website || provider.facebook_url || provider.instagram_url || provider.youtube_url || provider.tiktok_url;

    if (!hasSocialLinks) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-slate-200/80 rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-start gap-4">
            {provider.phone && (
                <a href={`tel:${provider.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                    <Phone className="w-5 h-5" />
                    <span className="text-sm font-medium">Hívás</span>
                </a>
            )}
            {provider.website && (
                <a href={provider.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                    <Globe className="w-5 h-5" />
                     <span className="text-sm font-medium">Weboldal</span>
                </a>
            )}
            {provider.facebook_url && (
                <a href={provider.facebook_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                    <Facebook className="w-6 h-6" />
                </a>
            )}
            {provider.instagram_url && (
                <a href={provider.instagram_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors">
                    <Instagram className="w-6 h-6" />
                </a>
            )}
            {provider.youtube_url && (
                <a href={provider.youtube_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
                    <Youtube className="w-6 h-6" />
                </a>
            )}
            {provider.tiktok_url && (
                <a href={provider.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-black transition-colors">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.6-2.95-1.5-1.72-2.29-3.88-2.39-6.09-.21-4.74 3.42-8.62 7.82-8.62.17 0 .34 0 .5.02v3.98c-1.39.01-2.78-.02-4.17-.01-.13 1.25.27 2.52 1.07 3.54 1.01 1.29 2.7 2.01 4.29 1.87 1.55-.12 2.95-1.03 3.82-2.33.51-.74.83-1.6.93-2.51.02-3.13.02-6.26.02-9.39-.01-.2-.01-.4-.02-.6.01-.06.01-.12.02-.18.08-1.53.63-3.09 1.75-4.17 1.12-1.11 2.7-1.62 4.24-1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.6-2.95-1.5-1.72-2.29-3.88-2.39-6.09-.21-4.74 3.42-8.62 7.82-8.62.17 0 .34 0 .5.02v3.98c-1.39.01-2.78-.02-4.17-.01-.13 1.25.27 2.52 1.07 3.54 1.01 1.29 2.7 2.01 4.29 1.87 1.55-.12 2.95-1.03 3.82-2.33.51-.74.83-1.6.93-2.51.02-3.13.02-6.26.02-9.39-.01-.2-.01-.4-.02-.6Z" /></svg>
                </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}