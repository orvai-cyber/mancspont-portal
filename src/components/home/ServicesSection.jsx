
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Sun, GraduationCap, Heart, ArrowRight, Plus } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    key: "panzio",
    icon: Home,
    title: "Kutyapanziók",
    description: "Biztonságos hely, ha hosszabb időre elutazol.",
    color: "bg-blue-100 text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    key: "napkozi", // Corrected 'napköz' to 'napkozi' for consistency
    icon: Sun,
    title: "Napközik", 
    description: "Vidám napok felügyelet alatt, amíg dolgozol.",
    color: "bg-orange-100 text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    key: "iskola",
    icon: GraduationCap,
    title: "Kutyaiskolák",
    description: "Szakértők segítenek a nevelésben és képzésben.",
    color: "bg-purple-100 text-purple-600", 
    bgColor: "bg-purple-50"
  },
  {
    key: "szitter",
    icon: Heart,
    title: "Szitterek",
    description: "Gondoskodó társ, amikor te nem tudsz ott lenni.",
    color: "bg-pink-100 text-pink-600",
    bgColor: "bg-pink-50"
  }
];

const ServiceCard = ({ service, index }) => {
  const { icon: Icon, title, description, color, bgColor } = service;
  
  return (
    <Link to={createPageUrl(`Services?category=${service.key}`)} className="h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className="group h-full"
        >
          <Card className={`${bgColor} border-0 h-full transition-all duration-300 group-hover:shadow-lg cursor-pointer`}>
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </CardContent>
          </Card>
        </motion.div>
    </Link>
  );
};

export default function ServicesSection() {
  return (
    <section className="py-20 relative overflow-hidden" style={{
      background: `linear-gradient(to right, rgb(248 250 252), rgb(182 198 219 / 50%), rgb(207 201 213 / 30%))`
    }}>
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-100/15 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Szolgáltatások</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Minden, amire egy gazdinak szüksége lehet
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Kutyapanziók, napközik, kutyaiskolák és szitterek egy helyen – hogy kedvenced mindig a legjobb kezekben legyen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={createPageUrl("Services")}>
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Szolgáltatások böngészése
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajánlj nekünk egyet
              </Button>
            </div>
          </motion.div>

          {/* Right Side - Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
