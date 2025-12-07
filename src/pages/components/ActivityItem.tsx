import { Eye, Bookmark, FileText, Filter } from 'lucide-react';

interface ActivityItemProps {
  type: 'view' | 'save' | 'report' | 'filter';
  name: string;
  location: string;
  time: string;
  condition: 'good' | 'satisfactory' | 'critical' | null;
}

const typeConfig = {
  view: { icon: Eye, label: 'Просмотр', color: 'text-blue-600 bg-blue-50' },
  save: { icon: Bookmark, label: 'Сохранение', color: 'text-indigo-600 bg-indigo-50' },
  report: { icon: FileText, label: 'Отчет', color: 'text-slate-600 bg-slate-50' },
  filter: { icon: Filter, label: 'Фильтр', color: 'text-cyan-600 bg-cyan-50' }
};

const conditionColors = {
  good: 'bg-green-100 text-green-700',
  satisfactory: 'bg-yellow-100 text-yellow-700',
  critical: 'bg-red-100 text-red-700'
};

const conditionLabels = {
  good: 'Хорошее',
  satisfactory: 'Удовл.',
  critical: 'Критич.'
};

export function ActivityItem({ type, name, location, time, condition }: ActivityItemProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
      <div className={`w-9 h-9 rounded-lg ${config.color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="text-sm text-slate-900 group-hover:text-[#2B80FF] transition-colors">{name}</div>
          {condition && (
            <span className={`px-2 py-0.5 rounded text-xs flex-shrink-0 ${conditionColors[condition]}`}>
              {conditionLabels[condition]}
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500">{location}</div>
        <div className="text-xs text-slate-400 mt-1">{time}</div>
      </div>
    </div>
  );
}
