import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = [];
  // Logic to create page numbers array (e.g., 1, 2, '...', 5, 6, 7, '...', 12)
  // For simplicity, we'll just show a few pages around the current one.
  const pagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
  
  if(totalPages > pagesToShow && endPage - startPage < pagesToShow - 1) {
    startPage = endPage - pagesToShow + 1;
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {startPage > 1 && (
        <>
          <Button variant={1 === currentPage ? "default" : "outline"} onClick={() => onPageChange(1)}>1</Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}
      
      {pageNumbers.map(number => (
        <Button key={number} variant={number === currentPage ? "default" : "outline"} onClick={() => onPageChange(number)}>
          {number}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button variant={totalPages === currentPage ? "default" : "outline"} onClick={() => onPageChange(totalPages)}>{totalPages}</Button>
        </>
      )}

      <Button variant="outline" size="icon" onClick={handleNext} disabled={currentPage === totalPages}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}