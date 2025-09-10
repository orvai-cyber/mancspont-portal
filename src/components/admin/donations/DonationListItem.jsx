import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';

const statusConfig = {
  beérkezett: { label: 'Beérkezett', color: 'bg-blue-100 text-blue-800' },
  kifizetett: { label: 'Kifizetett', color: 'bg-green-100 text-green-800' },
};

export default function DonationListItem({ donation, onViewDetails }) {
  const statusInfo = statusConfig[donation.status] || {};
  const isAnon = donation.is_anonymous;
  const donorName = isAnon ? 'Névtelen Adományozó' : donation.donor_name;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{isAnon ? <Shield className="w-4 h-4" /> : donorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{donorName}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{donation.amount.toLocaleString()} Ft</span>
              <span>{format(new Date(donation.created_date), 'yyyy. MMM d.', { locale: hu })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          <Button size="sm" variant="outline" onClick={() => onViewDetails(donation)}>
            <Eye className="w-4 h-4 mr-1" />
            Részletek
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}