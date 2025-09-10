import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Gift, User, Calendar, Mail, MessageSquare, Shield, Hash, Banknote } from 'lucide-react';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 py-3 border-b">
    <Icon className="w-5 h-5 text-gray-500 mt-1" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || '-'}</p>
    </div>
  </div>
);

export default function DonationDetailsDialog({ donation, isOpen, onClose }) {
  if (!donation) return null;

  const isAnon = donation.is_anonymous;
  const donorName = isAnon ? 'Névtelen Adományozó' : donation.donor_name;
  const donorEmail = isAnon ? 'N/A' : donation.donor_email;
  const statusLabel = donation.status === 'beérkezett' ? 'Beérkezett' : 'Kifizetett';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-orange-500" />
            Adomány Részletei
          </DialogTitle>
          <DialogDescription>
            Tranzakció ID: {donation.transaction_id || 'N/A'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <DetailRow icon={Banknote} label="Összeg" value={`${donation.amount.toLocaleString()} ${donation.currency}`} />
          <DetailRow icon={isAnon ? Shield : User} label="Adományozó" value={donorName} />
          <DetailRow icon={Mail} label="Email cím" value={donorEmail} />
          <DetailRow icon={Calendar} label="Dátum" value={format(new Date(donation.created_date), 'yyyy. MMMM d., HH:mm', { locale: hu })} />
          <DetailRow icon={Hash} label="Státusz" value={statusLabel} />
          {donation.message && <DetailRow icon={MessageSquare} label="Üzenet" value={donation.message} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}