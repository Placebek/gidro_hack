import { MapPin, Calendar } from 'lucide-react';

interface SavedItemProps {
  name: string;
  type: string;
  region: string;
  condition: 'good' | 'satisfactory' | 'critical';
  lastInspection: string;
}

const conditionConfig = {
  good: { color: 'bg-green-500', label: 'Хорошее состояние' },
  satisfactory: { color: 'bg-yellow-500', label: 'Удовлетворительное' },
  critical: { color: 'bg-red-500', label: 'Критическое состояние' }
};

export function SavedItem({ name, type, region, condition, lastInspection }: SavedItemProps) {
  const config = conditionConfig[condition];

  return (
    <div className="p-4 border border-slate-200 rounded-lg hover:border-[#2B80FF] hover:shadow-sm transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-sm text-slate-900 group-hover:text-[#2B80FF] transition-colors mb-1">
            {name}
          </div>
          <div className="text-xs text-slate-500">{type}</div>
        </div>
        <div className={`w-3 h-3 rounded-full ${config.color} flex-shrink-0 mt-1`} title={config.label}></div>
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{region}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{lastInspection}</span>
        </div>
      </div>
    </div>
  );
}
