import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Building, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Animal } from '@/api/entities';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';

export default function AnimalListItem({ animal, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await Animal.delete(animal.id);
      onDeleted(animal.id);
    } catch (error) {
      console.error("Hiba az állat törlése során:", error);
      toast.error("Hiba történt az állat törlése során.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getSpeciesColor = (species) => {
    const colors = {
      'kutya': 'bg-blue-100 text-blue-800',
      'macska': 'bg-purple-100 text-purple-800',
      'nyúl': 'bg-green-100 text-green-800',
      'madár': 'bg-yellow-100 text-yellow-800',
      'egyéb': 'bg-gray-100 text-gray-800'
    };
    return colors[species] || colors['egyéb'];
  };

  const getSizeColor = (size) => {
    const colors = {
      'kicsi': 'bg-emerald-100 text-emerald-800',
      'közepes': 'bg-amber-100 text-amber-800',
      'nagy': 'bg-red-100 text-red-800',
      'óriás': 'bg-purple-100 text-purple-800'
    };
    return colors[size] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50/70 transition-colors duration-200">
      <div className="flex items-center gap-4 flex-grow">
        <img
          src={animal.photos?.[0] || `https://placehold.co/40x40/e2e8f0/cccccc/png?text=${animal.name?.charAt(0) || 'A'}`}
          alt={animal.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-lg truncate">{animal.name}</h3>
            {animal.species && (
              <Badge className={getSpeciesColor(animal.species)}>
                {animal.species}
              </Badge>
            )}
            {animal.breed && (
              <Badge variant="outline">
                {animal.breed}
              </Badge>
            )}
            {animal.age && (
              <Badge variant="outline">
                {animal.age}
              </Badge>
            )}
            {animal.size && (
              <Badge className={getSizeColor(animal.size)}>
                {animal.size}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">
            {animal.shelter_name || 'Nincs menhely'}
            {animal.location && animal.county && ` • ${animal.location}, ${animal.county}`}
            {!animal.location && animal.county && ` • ${animal.county}`}
            {animal.created_date && (
                <span className="ml-2 inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(animal.created_date), 'yyyy. MMM d.', { locale: hu })}
                </span>
            )}
          </p>
        </div>
      </div>

      {/* Műveletek */}
      <div className="flex items-center gap-2 mt-4 md:mt-0 md:ml-4 flex-shrink-0">
        <Link to={createPageUrl(`AdminEditAnimal?action=edit&id=${animal.id}`)}>
          <Button variant="outline" size="sm">
            <Pencil className="w-4 h-4 mr-2" />
            Szerkesztés
          </Button>
        </Link>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Törlés
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Állat törlése</AlertDialogTitle>
              <AlertDialogDescription>
                Biztosan törölni szeretnéd <strong>{animal.name}</strong> állatot?
                Ez a művelet nem vonható vissza.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Mégse</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Törlés...' : 'Törlés'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}