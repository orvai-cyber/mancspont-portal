import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, PawPrint, Home, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdoptionRequestDetailsDialog({ isOpen, onClose, request }) {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Örökbefogadási kérelem részletei
            <Badge variant="outline">{request.status}</Badge>
          </DialogTitle>
          <DialogDescription>
            {request.user_name} jelentkezése a következő állatra: {request.animal_name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Left Column: Applicant Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-800">Jelentkező adatai</h4>
            <div className="space-y-3">
              <InfoItem icon={User} label="Név" value={request.user_name} />
              <InfoItem icon={Mail} label="Email" value={request.user_email} href={`mailto:${request.user_email}`} />
              <InfoItem icon={Phone} label="Telefon" value={request.user_phone} href={`tel:${request.user_phone}`} />
              <InfoItem icon={MapPin} label="Cím" value={request.user_address || "Nincs megadva"} />
            </div>
            <Separator />
             <h4 className="font-semibold text-lg text-gray-800">Bemutatkozás</h4>
             <ScrollArea className="h-40 w-full rounded-md border p-4 text-sm">
                {request.introduction || "Nincs bemutatkozás megadva."}
             </ScrollArea>
          </div>

          {/* Right Column: Photos */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-800">Otthonról készült fotók</h4>
            {request.home_photos && request.home_photos.length > 0 ? (
              <ScrollArea className="h-80 w-full rounded-md border">
                 <div className="p-4 grid grid-cols-2 gap-4">
                  {request.home_photos.map((photo, index) => (
                    <a key={index} href={photo} target="_blank" rel="noopener noreferrer" title="Kattintson a nagyításhoz">
                      <img 
                        src={photo} 
                        alt={`Otthon fotó ${index + 1}`} 
                        className="rounded-md object-cover w-full h-32 hover:opacity-80 transition-opacity" 
                      />
                    </a>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-80 rounded-md border border-dashed text-gray-500">
                Nincsenek fotók feltöltve.
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Bezárás</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const InfoItem = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {href ? (
        <a href={href} className="text-base font-semibold text-blue-600 hover:underline break-all">
          {value}
        </a>
      ) : (
        <p className="text-base font-semibold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);