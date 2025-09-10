import React from 'react';
import { Heart, Users, MessageSquare, Camera, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  {
    icon: Heart,
    value: "2,500+",
    label: "Sikertörténet",
    color: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    icon: Users,
    value: "25,000+",
    label: "Aktív tag",
    color: "text-blue-600", 
    bgColor: "bg-blue-100"
  },
  {
    icon: MessageSquare,
    value: "50,000+",
    label: "Hozzászólás",
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    icon: Camera,
    value: "5,000+",
    label: "Megosztott fotó",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  }
];

export default function CommunityStats() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Építsünk együtt közösséget
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Segíts, hogy elérjük az alábbi céljainkat és egy igazán támogató és inspiráló közösséget hozzunk létre!
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="space-y-1">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}