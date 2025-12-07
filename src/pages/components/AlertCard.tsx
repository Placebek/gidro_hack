import { AlertCircle, Clock } from 'lucide-react';

interface AlertCardProps {
  title: string;
  structure: string;
  priority: 'critical' | 'high' | 'medium';
  date: string;
}

const priorityConfig = {
  critical: { color: 'border-red-300 bg-red-50', badge: 'bg-red-500 text-white', dot: 'bg-red-500' },
  high: { color: 'border-orange-300 bg-orange-50', badge: 'bg-orange-500 text-white', dot: 'bg-orange-500' },
  medium: { color: 'border-yellow-300 bg-yellow-50', badge: 'bg-yellow-500 text-white', dot: 'bg-yellow-500' }
};

export function AlertCard({ title, structure, priority, date }: AlertCardProps) {
  const config = priorityConfig[priority];

  return (
    <div className={`p-4 border rounded-lg ${config.color} hover:shadow-md transition-all cursor-pointer`}>
      <div className="flex items-start gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0 mt-1.5`}></div>
        <div className="flex-1">
          <div className="text-sm text-slate-900 mb-1">{title}</div>
          <div className="text-sm text-slate-700">{structure}</div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
        <Clock className="w-3.5 h-3.5" />
        <span>{date}</span>
      </div>
    </div>
  );
}
