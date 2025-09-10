
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Heart } from "lucide-react";

const amounts = [2500, 5000, 10000, 25000];

export default function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState("");

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-8 h-8 text-yellow-300" />
          <h2 className="text-3xl lg:text-4xl font-bold">
            Támogasd a munkánkat!
          </h2>
        </div>
        <p className="text-xl text-orange-100 leading-relaxed mb-6">
          A te adományod is segít, hogy minél több állat találjon szerető otthonra. 
          Minden forint számít, és közvetlenül a menhelyekhez jut el.
        </p>
        <div className="bg-white/10 p-6 rounded-2xl">
          <h4 className="font-semibold mb-4">Miért fontos a támogatásod?</h4>
          <ul className="space-y-3 text-orange-50">
            <li className="flex items-start gap-3">
              <Heart className="w-5 h-5 mt-1 text-orange-300 flex-shrink-0" />
              <span>Biztosítjuk az állatok orvosi ellátását, élelmét és biztonságos elhelyezését.</span>
            </li>
            <li className="flex items-start gap-3">
              <Heart className="w-5 h-5 mt-1 text-orange-300 flex-shrink-0" />
              <span>Támogatjuk a menhelyek működését és fejlesztését.</span>
            </li>
            <li className="flex items-start gap-3">
              <Heart className="w-5 h-5 mt-1 text-orange-300 flex-shrink-0" />
              <span>Segítünk a sürgős mentések és speciális esetek finanszírozásában.</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-gray-800">
        <h3 className="text-2xl font-bold mb-6 text-center">Válassz támogatási összeget</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {amounts.map(amount => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              className={`h-16 text-lg font-bold transition-all duration-200 ${selectedAmount === amount ? 'bg-orange-600 text-white border-orange-600' : 'text-gray-700'}`}
              onClick={() => handleAmountClick(amount)}
            >
              {amount.toLocaleString()} Ft
            </Button>
          ))}
        </div>
        
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Ft</span>
          <Input 
            type="text"
            placeholder="Egyedi összeg"
            value={customAmount ? customAmount.toLocaleString() : ""}
            onChange={handleCustomAmountChange}
            className="h-16 text-lg font-bold pl-12 pr-4 text-center border-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <Button size="lg" className="w-full h-16 bg-gradient-to-r from-green-600 to-green-700 text-white text-xl font-bold shadow-lg hover:shadow-xl transition-shadow">
          <Heart className="w-6 h-6 mr-3" />
          Adományozok
        </Button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Biztonságos fizetés bankkártyával.
        </p>
      </div>
    </div>
  );
}
