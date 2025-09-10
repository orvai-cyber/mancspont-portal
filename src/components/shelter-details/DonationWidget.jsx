
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function DonationWidget({ shelter }) {
  const [amount, setAmount] = useState(5000);
  const amounts = [2000, 5000, 10000, 25000];

  const handleDonateClick = () => {
    if (!amount || amount <= 0) {
        toast.error('Kérjük, adjon meg egy érvényes összeget a támogatáshoz.');
        return;
    }
    toast.info(`Köszönjük a ${amount.toLocaleString('hu-HU')} Ft-os felajánlást!`, {
      description: 'Az online fizetés jelenleg nem elérhető. Kérjük, vedd fel a kapcsolatot a menhellyel az adományozás véglegesítéséhez.',
      duration: 8000,
    });
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    const numericValue = parseInt(value, 10);
    // Csak akkor frissítünk, ha a beírt érték egy szám, vagy ha a mező üres
    if (!isNaN(numericValue)) {
      setAmount(numericValue);
    } else if (value === '') {
      setAmount('');
    }
  };

  return (
    <Card className="shadow-lg sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="text-red-500" />
          Támogasd a menhelyet!
        </CardTitle>
        <CardDescription>Minden segítség számít!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Az online fizetés jelenleg nem aktív. Kérjük, vedd fel a kapcsolatot közvetlenül a menhellyel.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {amounts.map((predefinedAmount) => (
            <Button
              key={predefinedAmount}
              type="button"
              variant={amount === predefinedAmount ? 'default' : 'outline'}
              onClick={() => setAmount(predefinedAmount)}
            >
              {predefinedAmount.toLocaleString()} Ft
            </Button>
          ))}
        </div>
        <div>
          <Label htmlFor="custom-amount">Egyedi összeg (Ft)</Label>
          <Input
            id="custom-amount"
            type="number"
            placeholder="pl. 5000"
            value={amount}
            onChange={handleCustomAmountChange}
          />
        </div>
        <Button 
          size="lg" 
          className="w-full bg-orange-500 text-white hover:bg-orange-600" 
          onClick={handleDonateClick}
          type="button"
        >
          <Heart className="w-5 h-5 mr-2" />
          Támogatás
        </Button>
      </CardContent>
    </Card>
  );
}
