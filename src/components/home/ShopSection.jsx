import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";

const products = [
  { name: "Eleség", image: "https://images.unsplash.com/photo-1585250003309-694ff8696248?w=300" },
  { name: "Játékok", image: "https://images.unsplash.com/photo-1541348263663-895399414e13?w=300" },
  { name: "Felszerelés", image: "https://images.unsplash.com/photo-1583084220513-c99374465a3d?w=300" },
  { name: "Ápolás", image: "https://images.unsplash.com/photo-1622397985868-6b8b0c40d1a4?w=300" },
];

export default function ShopSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="grid grid-cols-2 gap-4">
        {products.map((product, index) => (
          <div key={index} className="relative rounded-2xl overflow-hidden group">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-bold text-xl">{product.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center lg:text-left">
        <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
          <ShoppingBag className="w-8 h-8 text-green-400" />
          <h2 className="text-3xl lg:text-4xl font-bold">
            Minden, amire kedvencednek szüksége van
          </h2>
        </div>
        <p className="text-xl text-gray-300 leading-relaxed mb-8">
          Vásárlásoddal nemcsak kedvencedet kényezteted, hanem a menhelyi állatokat is támogatod. 
          Minden vásárlás után jutalékot kapunk partnereinktől.
        </p>
        <Link to={createPageUrl("Shop")}>
          <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl">
            Ugrás a Shopba
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}