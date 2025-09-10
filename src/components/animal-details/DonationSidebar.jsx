import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Gift, Calendar, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function DonationSidebar({ shelter, animal }) {
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('onetime');

  const oneTimeAmounts = [2000, 5000, 10000, 25000];
  const monthlyAmounts = [2500, 5000, 10000, 20000];

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleDonationTypeChange = (type) => {
    setDonationType(type);
    setCustomAmount('');
    setSelectedAmount(type === 'onetime' ? 5000 : 5000);
  };
  
  const finalAmount = customAmount || selectedAmount;
  const currentAmounts = donationType === 'onetime' ? oneTimeAmounts : monthlyAmounts;

  // Safe shelter name handling
  const shelterName = shelter?.name || 'menhely';
  const animalName = animal?.name || 'ezt az állatot';

  return (
    <>
      <Card className="shadow-lg border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-orange-500" />
            Támogasd {animalName} ellátását!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Adományoddal közvetlenül a {shelterName} munkáját segíted.</p>
            
            {/* Donation Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => handleDonationTypeChange('onetime')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        donationType === 'onetime' 
                            ? 'bg-orange-600 text-white shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <CreditCard className="w-4 h-4" />
                    Egyszeri
                </button>
                <button
                    onClick={() => handleDonationTypeChange('monthly')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        donationType === 'monthly' 
                            ? 'bg-orange-600 text-white shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <Calendar className="w-4 h-4" />
                    Havi
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {currentAmounts.map(amount => (
                    <Button 
                        key={amount} 
                        variant={selectedAmount === amount ? "default" : "outline"}
                        className={`h-10 text-sm ${selectedAmount === amount ? 'bg-orange-600 border-orange-600' : 'bg-white'}`}
                        onClick={() => handleAmountClick(amount)}
                    >
                        {amount.toLocaleString()} Ft
                    </Button>
                ))}
            </div>

            {/* Egyedi összeg csak egyszeri módban */}
            {donationType === 'onetime' && (
                <Input 
                  type="text"
                  placeholder="Egyedi összeg minimum 2500 Ft"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="h-10"
                />
            )}
            
            <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600">
                Adományozok {finalAmount ? `(${finalAmount.toLocaleString()} Ft ${donationType === 'monthly' ? '/hó' : ''})` : ''}
            </Button>
        </CardContent>
      </Card>
      
      {/* Virtual Adoption - TEMPORARILY COMMENTED OUT */}
      {/*
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h4 className="text-lg font-bold text-purple-800 mb-2">Légy virtuális gazdi!</h4>
          <p className="text-sm text-purple-700">
            Támogasd {animalName} gondozását havi rendszerességgel.
          </p>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="bg-white/80 rounded-lg p-3 border border-purple-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-purple-800">Étel & ivóvíz</span>
              <span className="text-sm font-bold text-purple-600">2,500 Ft/hó</span>
            </div>
          </div>
          <div className="bg-white/80 rounded-lg p-3 border border-purple-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-purple-800">Állatorvosi ellátás</span>
              <span className="text-sm font-bold text-purple-600">4,000 Ft/hó</span>
            </div>
          </div>
          <div className="bg-white/80 rounded-lg p-3 border border-purple-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-purple-800">Teljes támogatás</span>
              <span className="text-sm font-bold text-purple-600">8,500 Ft/hó</span>
            </div>
          </div>
        </div>
        
        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
          <Heart className="w-4 h-4 mr-2" />
          Virtuális gazdi leszek
        </Button>
      </div>
      */}
    </>
  );
}