import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, MapPin, PawPrint, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const ShelterCard = ({ shelter }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="group"
  >
    <Card className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden bg-white">
      <CardContent className="p-8 text-center">
        <div className="relative inline-block mb-6">
          <img 
            src={shelter.logo_url}
            alt={`${shelter.name} logo`}
            className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-white shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
            <Heart className="w-5 h-5 text-orange-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{shelter.name}</h3>
        <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{shelter.location}</span>
        </div>
        <p className="text-gray-600 mb-6 h-12 overflow-hidden">
          {shelter.description}
        </p>
        <Link 
          to={createPageUrl(`ShelterDetails?id=${shelter.id}`)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-800 font-semibold rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-300"
        >
          Profil megtekintése <ArrowRight className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  </motion.div>
);

const ShelterCardSkeleton = () => (
  <Card className="rounded-2xl shadow-lg border-0">
    <CardContent className="p-8 text-center">
      <Skeleton className="w-24 h-24 rounded-full mx-auto mb-6" />
      <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
      <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mx-auto mb-6" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </CardContent>
  </Card>
);

export default function FeaturedShelters({ shelters, isLoading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {isLoading 
        ? Array(3).fill(0).map((_, i) => <ShelterCardSkeleton key={i} />)
        : shelters.slice(0,3).map(shelter => <ShelterCard key={shelter.id} shelter={shelter} />)
      }
    </div>
  );
}