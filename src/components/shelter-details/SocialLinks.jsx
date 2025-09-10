
import React from 'react';
import { Globe, Facebook, Instagram } from 'lucide-react'; // Assuming lucide-react for icons

export default function SocialLinks({ shelter }) {
  // No need for hasFacebook, hasInstagram anymore as we render directly
  // based on shelter properties.

  // The Card, CardContent, and Button components are removed as per the outline.
  return (
    <div className="shadow-lg border-gray-100 p-4"> {/* Replaced Card and CardContent with a div */}
      <div className="flex justify-center space-x-6"> {/* Updated div for spacing */}
        {shelter.website && (
          <a
            href={shelter.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Globe className="w-8 h-8" /> {/* New Globe icon */}
          </a>
        )}
        {shelter.facebook && (
          <a
            href={shelter.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Facebook className="w-8 h-8" /> {/* Updated Facebook icon */}
          </a>
        )}
        {shelter.instagram && (
          <a
            href={shelter.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700 transition-colors"
          >
            <Instagram className="w-8 h-8" /> {/* Updated Instagram icon */}
          </a>
        )}
      </div>
    </div>
  );
}
