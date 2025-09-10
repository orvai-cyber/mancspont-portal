import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function DescriptionSection({ description }) {
  return (
    <Card className="shadow-lg border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          Bemutatkozás
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm sm:prose-base max-w-none text-gray-700">
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}