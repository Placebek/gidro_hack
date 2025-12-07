import { FileText, Download, CheckCircle } from 'lucide-react';

interface ReportCardProps {
  title: string;
  date: string;
  objects: number;
  status: 'completed' | 'draft' | 'pending';
}

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-600', label: 'Завершен' },
  draft: { icon: FileText, color: 'text-slate-500', label: 'Черновик' },
  pending: { icon: FileText, color: 'text-orange-500', label: 'В работе' }
};

export function ReportCard({ title, date, objects, status }: ReportCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="p-4 border border-slate-200 rounded-lg hover:border-[#2B80FF] hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-900 group-hover:text-[#2B80FF] transition-colors mb-1">
              {title}
            </div>
            <div className="text-xs text-slate-500">{date} • {objects} объектов</div>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
          <Download className="w-4 h-4 text-slate-600" />
        </button>
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
        <span className={config.color}>{config.label}</span>
      </div>
    </div>
  );
}
