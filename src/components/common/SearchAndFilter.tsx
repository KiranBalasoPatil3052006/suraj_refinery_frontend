import React from 'react';
import { Search, User, Hash, Sparkles } from 'lucide-react';
import { FilterCategory } from '../../types/certificate';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}) => {
  const filters: { id: FilterCategory; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All' },
    { id: 'name', label: 'Name', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'serialNo', label: 'Serial No', icon: <Hash className="w-3.5 h-3.5" /> },
    { id: 'purity', label: 'Purity', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col space-y-3 px-1">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, serial no or purity..."
          className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-800 text-xs sm:text-sm border border-slate-300 rounded-xl shadow-xs placeholder:text-slate-400 focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 transition-all"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar select-none">
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onFilterChange(f.id)}
              className={`py-1.5 px-3 rounded-full text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-all active:scale-95 ${
                isActive
                  ? 'bg-brand-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {f.icon}
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
