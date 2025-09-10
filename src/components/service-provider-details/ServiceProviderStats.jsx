import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MessageSquare, DollarSign, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, bgColor, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/50">
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600 font-medium">{label}</div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function ServiceProviderStats({ provider }) {
  const priceLabels = {
    budget: '$',
    standard: '$$', 
    premium: '$$$'
  };

  return (
    <div className="-mt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            icon={Star}
            label="Értékelés"
            value={provider.rating ? provider.rating.toFixed(1) : 'N/A'}
            bgColor="bg-gradient-to-br from-yellow-400 to-orange-500"
            delay={0.1}
          />
          <StatCard 
            icon={MessageSquare}
            label="Vélemény"
            value={provider.review_count || 0}
            bgColor="bg-gradient-to-br from-blue-400 to-indigo-500"
            delay={0.2}
          />
          <StatCard 
            icon={DollarSign}
            label="Árszint"
            value={priceLabels[provider.price_level] || 'N/A'}
            bgColor="bg-gradient-to-br from-green-400 to-emerald-500"
            delay={0.3}
          />
          <StatCard 
            icon={Wrench}
            label="Szolgáltatás"
            value={provider.services_offered?.length || 0}
            bgColor="bg-gradient-to-br from-purple-400 to-violet-500"
            delay={0.4}
          />
        </div>
      </div>
    </div>
  );
}