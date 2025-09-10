import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function CategoryFilters({ 
  categories, 
  categoryConfig = {}, 
  activeCategory, 
  onCategoryChange 
}) {
  if (!categories || categories.length <= 1) return null;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const config = categoryConfig[category] || { 
            label: category, 
            color: 'bg-gray-100 text-gray-800' 
          };
          
          return (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={`relative transition-all duration-200 ${
                activeCategory === category 
                  ? 'bg-green-600 text-white border-green-600 shadow-md' 
                  : 'hover:bg-green-50 hover:border-green-200 hover:text-green-700'
              }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="category-active"
                  className="absolute inset-0 bg-green-600 rounded-md"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{config.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}