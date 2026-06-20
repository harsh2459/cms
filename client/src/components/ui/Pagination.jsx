import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="flex gap-1 items-center">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
        disabled={currentPage === 1} 
        className="btn-icon btn-ghost disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-1 px-1">
        {pages.map((p, i) => (
          p === '...' ? (
            <span key={`dots-${i}`} className="px-1 text-slate-400 font-medium">...</span>
          ) : (
            <button 
              key={p} 
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                currentPage === p ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          )
        ))}
      </div>
      
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
        disabled={currentPage === totalPages} 
        className="btn-icon btn-ghost disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
