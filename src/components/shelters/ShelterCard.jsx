
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MapPin, Heart, Users, Calendar, ArrowRight, AlertCircle, TrendingUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import ResponsiveImage from '../shared/ResponsiveImage';

export default function ShelterCard({ shelter }) {
  const donationProgress = shelter.donation_goal ?
    Math.min((shelter.animals_helped * 100) / shelter.donation_goal * 100, 100) : 0;

  return (
    <motion.div
      layout
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/80 overflow-hidden transform hover:-translate-y-2 h-full flex flex-col"
    >
      {/* Header with Logo */}
      <Link to={createPageUrl(`ShelterDetails?id=${shelter.id}`)} className="relative bg-gradient-to-br from-orange-50 to-orange-100 p-6 text-center block">
        <div className="relative inline-block mb-4">
          <ResponsiveImage
            src={shelter.logo_url}
            alt={`${shelter.name} logo`}
            size="small"
            aspectRatio="square"
            className="w-20 h-20 rounded-full mx-auto ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform"
          />
          <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md">
            <Heart className="w-4 h-4 text-orange-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
          {shelter.name}
        </h3>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>{shelter.location}</span>
          </div>
          {shelter.county && (
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Globe className="w-4 h-4 text-green-500" />
              <span>{shelter.county} vármegye</span>
            </div>
          )}
        </div>
      </Link>

      <Link to={createPageUrl(`ShelterDetails?id=${shelter.id}`)} className="p-6 flex-grow flex flex-col">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 lg:mb-6 text-center">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{shelter.capacity}</div>
            <div className="text-xs text-gray-500">Kapacitás</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-lg font-bold text-green-600">{shelter.animals_helped}</div>
            <div className="text-xs text-gray-500">Új gazdi</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{shelter.foundation_year}</div>
            <div className="text-xs text-gray-500">Alapítva</div>
          </div>
        </div>

        {/* Current Animals Status */}
        <div className="mb-3 lg:mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Jelenlegi lakóink:</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {shelter.currentAnimalsCount || 0}
              </Badge>
              {shelter.urgentAnimalsCount > 0 && (
                <Badge className="text-xs bg-red-100 text-red-800 flex items-center gap-1 whitespace-nowrap">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {shelter.urgentAnimalsCount} sürgős
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Donation Goal Progress */}
        {shelter.donation_goal && (
          <div className="mb-4 lg:mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Havi cél</span>
              <span className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {Math.round(donationProgress)}%
              </span>
            </div>
            <Progress value={donationProgress} className="h-2 mb-2" />
            <div className="text-xs text-green-600 text-center">
              {shelter.donation_goal.toLocaleString()} Ft cél
            </div>
          </div>
        )}
      </Link>

      {/* Action Buttons */}
      <div className="p-6 pt-0 space-y-3">
        <div onClick={(e) => e.stopPropagation()}>
          <Link to={createPageUrl(`ShelterDetails?id=${shelter.id}`)} className="w-full block">
            <Button className="w-full bg-gray-100 text-gray-800 font-semibold hover:bg-orange-600 hover:text-white transition-colors duration-300 shadow-none hover:shadow-lg">
              Profil megtekintése <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" className="w-full border-2 border-orange-200 text-orange-700 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-colors">
            <Heart className="w-4 h-4 mr-2" />
            Támogatom
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
