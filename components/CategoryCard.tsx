import React from 'react';
import { Coffee, Pizza, PenTool } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: 'food' | 'snack' | 'stationery';
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, onClick }) => {
  const Icon = icon === 'food' ? Pizza : icon === 'snack' ? Coffee : PenTool;

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-xl hover:shadow-lg hover:border-slate-200 transition-all cursor-pointer h-48 w-full"
    >
      <div className="mb-4 text-slate-600 group-hover:text-slate-800 transition-colors">
        <Icon size={40} strokeWidth={1} />
      </div>
      <h3 className="text-lg font-medium text-slate-700 group-hover:text-slate-900">{title}</h3>
    </div>
  );
};

export default CategoryCard;