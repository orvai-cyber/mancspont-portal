
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, Users, MessageSquare } from 'lucide-react';

export default function CommunityGuidelines() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="w-5 h-5 text-green-600" />
          Közösségi irányelvek
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Legyél kedves</p>
              <p className="text-xs text-gray-600">Tiszteld mások véleményét és tapasztalatait.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Segíts másoknak</p>
              <p className="text-xs text-gray-600">Oszd meg tudásodat és tapasztalataidat.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MessageSquare className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Relevánsan posztolj</p>
              <p className="text-xs text-gray-600">Tartsd magad az állatok témájához.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            A szabályok megsértése esetén moderálhatjuk a tartalmat.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
