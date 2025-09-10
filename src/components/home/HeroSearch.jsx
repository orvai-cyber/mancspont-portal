import React, { useState } from "react";
import { Search, MapPin, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export default function HeroSearch() {
  const [species, setSpecies] = useState("all");
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // TODO: Implement search logic with all 3 parameters
    console.log(`Searching for ${species} in ${location} with term: ${searchTerm}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="max-w-4xl mx-auto mt-10"
    >
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl shadow-black/20 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="relative md:col-span-2">
           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
           <Input
            type="text"
            placeholder="Keress névre, fajtára, menhelyre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 bg-transparent border-none text-lg md:text-lg text-base pl-12 focus:ring-0 text-gray-900 placeholder-gray-500"
          />
        </div>
        <div className="relative md:border-l border-gray-200">
          <PawPrint className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Select value={species} onValueChange={setSpecies}>
            <SelectTrigger className="w-full h-14 bg-transparent border-none text-lg pl-12 focus:ring-0 text-gray-900">
              <SelectValue placeholder="Faj" className="text-gray-900" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Minden állat</SelectItem>
              <SelectItem value="kutya">Kutya</SelectItem>
              <SelectItem value="macska">Macska</SelectItem>
              <SelectItem value="nyul">Nyúl</SelectItem>
              <SelectItem value="egyeb">Egyéb</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={handleSearch} 
          className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          Keresés
        </Button>
      </div>
    </motion.div>
  );
}