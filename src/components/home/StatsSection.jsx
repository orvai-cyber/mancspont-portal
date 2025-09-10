
import React from "react";
import { Heart, PawPrint, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: PawPrint,
    value: "2,500+",
    label: "Sikeres örökbefogadás",
    color: "text-green-600",
  },
  {
    icon: Heart,
    value: "150+",
    label: "Partner menhely",
    color: "text-orange-600",
  },
  {
    icon: Users,
    value: "50,000+",
    label: "Támogató közösség",
    color: "text-blue-600",
  },
  {
    icon: Award,
    value: "98%",
    label: "Gazdi elégedettség",
    color: "text-purple-600",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Céljaink számokban
            </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-6"
            >
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
