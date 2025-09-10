import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactWidget({ onContactClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-lg border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">Kapcsolatfelvétel</CardTitle>
          <p className="text-gray-600">Kérdése van? Írjon nekünk!</p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onContactClick}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Send className="w-5 h-5 mr-2" />
            Üzenet küldése
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}