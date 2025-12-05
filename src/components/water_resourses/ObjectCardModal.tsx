import { X, MapPin, Droplet, Calendar, Fish, FileText, AlertCircle, Navigation } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { type WaterObject, getConditionColor, getConditionLabel, getPriorityLevel, resourceTypeLabels, waterTypeLabels } from '../../data/mockData';

interface ObjectCardModalProps {
  object: WaterObject;
  onClose: () => void;
}

export function ObjectCardModal({ object, onClose }: ObjectCardModalProps) {
  const conditionColor = getConditionColor(object.technicalCondition);
  const conditionLabel = getConditionLabel(object.technicalCondition);
  const priorityInfo = getPriorityLevel(object.priority || 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const passportAge = Math.floor((new Date().getTime() - new Date(object.passportDate).getTime()) / (1000 * 60 * 60 * 24 * 365));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="relative bg-gradient-to-br from-[#2B80FF] to-[#1E5FCC] p-8 text-white">
          <Button variant="ghost" size="sm" onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Droplet className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="mb-2">{object.name}</h2>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span>{object.region}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-150px)]">
          <div className="flex flex-wrap gap-2">
            <Badge style={{ backgroundColor: conditionColor + '20', color: conditionColor, border: `1px solid ${conditionColor}40` }}>
              <AlertCircle className="w-4 h-4" /> {conditionLabel}
            </Badge>
            <Badge style={{ backgroundColor: priorityInfo.color + '20', color: priorityInfo.color, border: `1px solid ${priorityInfo.color}40` }}>
              Приоритет: {priorityInfo.level}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Тип ресурса</div>
              <p>{resourceTypeLabels[object.resourceType]}</p>
            </div>
            <div>
              <div className="text-sm text-gray-500">Тип воды</div>
              <p>{waterTypeLabels[object.waterType]}</p>
            </div>
            <div>
              <div className="text-sm text-gray-500">Фауна</div>
              <p>{object.hasFauna ? 'Да' : 'Нет'}</p>
            </div>
            <div>
              <div className="text-sm text-gray-500">Дата паспорта</div>
              <p>{formatDate(object.passportDate)}</p>
              <p className="text-sm text-gray-400">({passportAge} {passportAge === 1 ? 'год' : passportAge < 5 ? 'года' : 'лет'} назад)</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 gap-2">
              <FileText className="w-4 h-4" />
              Открыть паспорт
            </Button>
            <Button variant="outline" className="gap-2">
              <MapPin className="w-4 h-4" />
              На карте
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
