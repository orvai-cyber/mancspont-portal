import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function AboutSection({ provider }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Bemutatkozás</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
            {provider.description}
          </p>
          
          {provider.services_offered && provider.services_offered.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Szolgáltatásaink</h3>
              <div className="flex flex-wrap gap-2">
                {provider.services_offered.map(service => (
                  <Badge key={service} variant="secondary" className="text-sm">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}