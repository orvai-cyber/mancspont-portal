import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, ShieldCheck } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const amounts = [2000, 5000, 10000, 25000];

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomAmount(value);
    setSelectedAmount(null);
  };
  
  const finalAmount = customAmount || selectedAmount;

  return (
    <Card className="shadow-2xl shadow-gray-200/80 border-0 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gray-900 text-white p-8 text-center">
        <CardTitle className="text-3xl font-bold">Támogasd őket most!</CardTitle>
        <CardDescription className="text-gray-300 text-lg">Válassz egy összeget, és segíts ma!</CardDescription>
      </CardHeader>
      <CardContent className="p-8 md:p-12">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <Label htmlFor="donation-frequency" className={`font-semibold ${!isMonthly ? 'text-orange-600' : 'text-gray-500'}`}>Egyszeri</Label>
          <Switch id="donation-frequency" checked={isMonthly} onCheckedChange={setIsMonthly} />
          <Label htmlFor="donation-frequency" className={`font-semibold ${isMonthly ? 'text-orange-600' : 'text-gray-500'}`}>Havi</Label>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {amounts.map(amount => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              className={`h-20 text-xl font-bold transition-all duration-200 border-2 rounded-xl ${selectedAmount === amount ? 'bg-orange-600 text-white border-orange-600 scale-105 shadow-lg' : 'text-gray-700 hover:border-orange-400'}`}
              onClick={() => handleAmountClick(amount)}
            >
              {amount.toLocaleString()} Ft
            </Button>
          ))}
        </div>
        
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">Ft</span>
          <Input 
            type="text"
            placeholder="Egyedi összeg"
            value={customAmount ? parseInt(customAmount).toLocaleString() : ""}
            onChange={handleCustomAmountChange}
            className="h-20 text-2xl font-bold pl-14 pr-4 text-center border-2 focus:ring-orange-500 focus:border-orange-500 rounded-xl"
          />
        </div>

        <Button size="lg" className="w-full h-20 bg-gradient-to-r from-green-600 to-green-700 text-white text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <Heart className="w-8 h-8 mr-4" />
          Támogatom {finalAmount ? `(${finalAmount.toLocaleString()} Ft)` : ''}
        </Button>
        <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          Biztonságos fizetés bankkártyával a Stripe rendszerén keresztül.
        </p>
      </CardContent>
    </Card>
  );
}