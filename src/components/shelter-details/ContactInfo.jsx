
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Globe, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactInfo({ shelter }) {
    const infoItems = [
        { icon: <Phone />, value: shelter.phone, href: `tel:${shelter.phone}` },
        { icon: <Mail />, value: shelter.email, href: `mailto:${shelter.email}` },
        { icon: <Globe />, value: shelter.website, href: shelter.website, target: "_blank" },
        { icon: <MapPin />, value: shelter.address, href: `https://maps.google.com/?q=${shelter.address}`, target: "_blank" },
    ];
  return (
    <Card className="shadow-lg border-gray-100">
      <CardHeader>
        <CardTitle>Elérhetőségek</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {infoItems.map(item => (
            <a key={item.value} href={item.href} target={item.target || "_self"} className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors group">
              <div className="w-8 h-8 flex-shrink-0 bg-gray-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center">
                  {React.cloneElement(item.icon, {className: "w-4 h-4 text-orange-600"})}
              </div>
              <span className="text-sm font-medium truncate">{item.value}</span>
            </a>
          ))}
        </div>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {/* TODO: Open messaging modal */}}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Írj üzenetet közvetlenül
        </Button>
      </CardContent>
    </Card>
  );
}
