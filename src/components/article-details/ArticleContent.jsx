import React from 'react';
import { motion } from 'framer-motion';

export default function ArticleContent({ article }) {
  // Mock content for demonstration
  const mockContent = `
    <p>Az örökbefogadás egy csodálatos dolog mind az állat, mind az új gazdi számára. Azonban fontos tudni, hogy az első napok otthon kritikusak lehetnek, és sok türelmet igényelnek mindkét fél részéről.</p>
    
    <h2>Az első 24 óra</h2>
    <p>Az első nap különösen stresszes lehet az új családtagnak. Fontos, hogy biztosítsunk neki egy nyugodt, biztonságos helyet, ahol visszavonulhat, ha úgy érzi.</p>
    
    <ul>
      <li>Készíts elő egy csendes szobát vagy sarkot</li>
      <li>Helyezz oda friss vizet és ételt</li>
      <li>Biztosíts kényelmes fekvőhelyet</li>
      <li>Ne erőltesd a közelséget</li>
    </ul>
    
    <blockquote>
      "A türelem kulcsfontosságú. Hagyd, hogy az állat a saját tempójában ismerkedjen az új környezettel." - Dr. Farkas Ágnes
    </blockquote>
    
    <h2>A második hét</h2>
    <p>A második hét már könnyebb lehet, de még mindig fontos a fokozatosság. Ilyenkor már elkezdheted kiépíteni a rutinokat és a szabályokat.</p>
    
    <p>Ne feledd: minden állat egyedi, és mindegyiknek más tempóban kell az alkalmazkodás. Legyél türelmes és megértő!</p>
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="prose prose-lg max-w-none mb-12"
    >
      <div 
        className="text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: mockContent }}
        style={{
          fontSize: '18px',
          lineHeight: '1.8'
        }}
      />
      
      <style jsx>{`
        .prose h2 {
          color: #1f2937;
          font-weight: 700;
          font-size: 1.75rem;
          margin: 2rem 0 1rem 0;
        }
        .prose ul {
          margin: 1.5rem 0;
        }
        .prose li {
          margin: 0.5rem 0;
          color: #4b5563;
        }
        .prose blockquote {
          border-left: 4px solid #10b981;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          font-size: 1.1rem;
          color: #6b7280;
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }
      `}</style>
    </motion.div>
  );
}