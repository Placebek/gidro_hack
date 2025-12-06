import { X, MapPin, Droplet, Calendar, Fish, FileText, AlertCircle, Navigation } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { type WaterObject, getConditionColor, getConditionLabel, getPriorityLevel, resourceTypeLabels, waterTypeLabels } from '../../data/mockData';

interface ObjectCardModalProps {
  object: WaterObject;
  onClose: () => void;
}

// hexToRgba лучше всего выше компонента
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

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
            <div className="flex-1 ">
              <h2 className="mb-2 text-2xl font-semibold">{object.name}</h2> {/* увеличил шрифт */}
              <div className="flex items-center gap-2 text-white/90 text-lg"> {/* увеличил шрифт */}
                <MapPin className="w-5 h-5" />
                <span>{object.region}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 mt-2 mb-2 space-y-4 overflow-y-auto max-h-[calc(90vh-150px)]">
          <div className="ml-2 flex flex-wrap gap-4 text-xl"> {/* увеличил шрифт до xl */}
            <Badge
              className="rounded-md text-lg "  // немного скруглил и увеличил шрифт
              style={{
                backgroundColor: hexToRgba(conditionColor, 0.2), // светлый фон
                color: conditionColor,                             // текст яркий
                border: `1px solid ${hexToRgba(conditionColor, 0.4)}` // мягкий контур
              }}
            >
              <AlertCircle className="w-5 h-5" /> {conditionLabel}
            </Badge>

            <Badge
              className="rounded-md text-lg"  // немного скруглил и увеличил шрифт
              style={{
                backgroundColor: hexToRgba(priorityInfo.color, 0.2),
                color: priorityInfo.color,
                border: `1px solid ${hexToRgba(priorityInfo.color, 0.4)}`
              }}
            >
              Приоритет: {priorityInfo.level}
            </Badge>
          </div>

          <div className="grid mt-6 grid-cols-2 gap-4 text-lg"> {/* увеличил шрифт */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-gray-500">
                  <Droplet className="w-4 h-4" />
                  <span>Тип ресурса</span>
                </div>
                <p className="text-lg ml-5">{resourceTypeLabels[object.resourceType]}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-gray-500">
                  <Droplet className="w-4 h-4" />
                  <span>Тип воды</span>
                </div>
                <p className="text-lg ml-5">{waterTypeLabels[object.waterType]}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-gray-500">
                  <Fish className="w-4 h-4" />
                  <span>Фауна</span>
                </div>
                <p className="text-lg ml-5">{object.hasFauna ? 'Да' : 'Нет'}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Дата паспорта</span>
                </div>
                <p className="text-lg ml-5">{formatDate(object.passportDate)}</p>
                <p className="text-sm text-gray-400 ml-5">({passportAge} {passportAge === 1 ? 'год' : passportAge < 5 ? 'года' : 'лет'} назад)</p>
              </div>

          </div>

          <div className="flex gap-3 pt-4 text-lg"> {/* увеличил шрифт */}
            <Button
              className="flex-1 gap-2 text-white bg-gradient-to-r from-[#2B80FF] to-[#1E5FCC] hover:from-[#1E70E0] hover:to-[#174BBB]"
            >
              <FileText className="w-5 h-5" />
              Редактировать
            </Button>

            <Button
              variant="outline"
              className="gap-2 text-white border border-transparent bg-gradient-to-r from-cyan-600 to-blue-800 hover:from-cyan-500 hover:to-blue-700"
            >
              <MapPin className="w-5 h-5" />
              На карте
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
