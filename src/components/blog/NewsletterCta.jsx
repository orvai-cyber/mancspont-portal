import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function NewsletterCta() {
  return (
    <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl shadow-lg border-0">
      <CardContent className="p-8 text-center">
        <div className="mx-auto bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2">Ne maradj le semmiről!</h3>
        <p className="text-green-100 mb-6 text-sm">
          Iratkozz fel hírlevelünkre a legfrissebb cikkekért és örökbefogadási hírekért!
        </p>
        <div className="flex flex-col gap-2">
          <Input 
            type="email"
            placeholder="E-mail címed"
            className="bg-white/90 text-gray-800 placeholder:text-gray-500 border-0 focus-visible:ring-2 focus-visible:ring-yellow-300"
          />
          <Button variant="default" className="bg-yellow-400 text-green-800 hover:bg-yellow-500 font-bold">
            Feliratkozom
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}