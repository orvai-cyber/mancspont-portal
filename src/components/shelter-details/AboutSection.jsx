import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function AboutSection({ description }) {
  return (
    <Card className="shadow-lg border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5 text-orange-600" />
          A menhelyről
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm sm:prose-base max-w-none text-gray-700">
        <p>{description || 'A menhely számára nem lett leírás megadva.'}</p>
      </CardContent>
    </Card>
  );
}