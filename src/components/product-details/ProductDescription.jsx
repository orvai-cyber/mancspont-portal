import React from 'react';
import { FileText, Award } from 'lucide-react';

export default function ProductDescription({ product }) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-6 h-6"/>Leírás</h2>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {product.expert_review && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-6 h-6 text-purple-600"/>Szakértőnk ajánlása</h2>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <p className="text-gray-800 italic">{`"${product.expert_review}"`}</p>
          </div>
        </div>
      )}
    </div>
  );
}