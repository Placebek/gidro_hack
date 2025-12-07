import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend: string;
  color: 'blue' | 'cyan' | 'indigo' | 'orange';
}

const colorClasses = {
  blue: 'bg-blue-50 text-[#2B80FF]',
  cyan: 'bg-cyan-50 text-cyan-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  orange: 'bg-orange-50 text-orange-600'
};

export function StatsCard({ icon: Icon, label, value, trend, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-600 mb-2">{label}</div>
      <div className="text-xs text-slate-500">{trend}</div>
    </div>
  );
}
