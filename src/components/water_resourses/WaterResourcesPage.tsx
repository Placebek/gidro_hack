import { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { waterObjects, type WaterObject, getConditionColor, waterObjectsWithPriority,  getConditionLabel, getPriorityLevel, resourceTypeLabels } from '../../data/mockData';
import { ObjectCardModal } from './ObjectCardModal';
import { Download, Filter, Info } from 'lucide-react';

export function WaterResources() {
  const [selectedObject, setSelectedObject] = useState<WaterObject | null>(null);

  return (
    <div className="max-w-[1450px] mt-25 mx-auto p-6">
      {/* Информационный блок сверху */}
      <div className="bg-gradient-to-r from-[#2B80FF] to-[#1E5FCC] p-8 text-white rounded-t-2xl shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Приоритизация объектов</h1>
            <p className="text-white/80">
              Объекты отсортированы по приоритету обслуживания
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="gap-2">
              <Filter className="w-4 h-4" />
              Фильтры
            </Button>
            <Button variant="secondary" className="gap-2">
              <Download className="w-4 h-4" />
              Экспорт
            </Button>
          </div>
        </div>

        {/* Формула расчета */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Формула расчета приоритета</p>
              <code className="text-sm bg-white/20 px-3 py-1 rounded-lg">
                Приоритет = (6 - Тех. состояние) × 3 + Возраст паспорта (годы)
              </code>
              <p className="text-sm text-white/70 mt-2">
                Чем выше значение, тем важнее объект для обслуживания
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats: отдельный белый блок снизу */}
      <div className="grid grid-cols-4 gap-6 p-6 bg-gray-50 border border-gray-200 -mt-6 shadow-lg">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Всего объектов</div>
          <div className="text-2xl font-bold text-gray-900">
            {waterObjectsWithPriority.length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Высокий приоритет</div>
          <div className="text-2xl font-bold text-[#EF4444]">
            {waterObjectsWithPriority.filter(o => (o.priority || 0) >= 10).length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Средний приоритет</div>
          <div className="text-2xl font-bold text-[#FBBF24]">
            {waterObjectsWithPriority.filter(o => (o.priority || 0) >= 5 && (o.priority || 0) < 10).length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Низкий приоритет</div>
          <div className="text-2xl font-bold text-[#10B981]">
            {waterObjectsWithPriority.filter(o => (o.priority || 0) < 5).length}
          </div>
        </div>
      </div>
      {/* Таблица */}
      <div className="overflow-x-auto bg-white rounded-b-2xl shadow-lg border border-gray-200 border-t-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-base font-semibold">#</TableHead>
              <TableHead className="text-base font-semibold">Название</TableHead>
              <TableHead className="text-base font-semibold">Регион</TableHead>
              <TableHead className="text-base font-semibold">Тип ресурса</TableHead>
              <TableHead className="text-base font-semibold">Состояние</TableHead>
              <TableHead className="text-base font-semibold">Приоритет</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waterObjects.map((obj, index) => {
              const conditionColor = getConditionColor(obj.technicalCondition);
              const conditionLabel = getConditionLabel(obj.technicalCondition);
              const priorityInfo = getPriorityLevel(obj.priority || 0);

              return (
                <TableRow
                  key={obj.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedObject(obj)}
                >
                  <TableCell className="text-gray-600 font-semibold text-base">{index + 1}</TableCell>
                  <TableCell className="text-black font-semibold text-lg">{obj.name}</TableCell>
                  <TableCell className="text-gray-600 font-semibold text-base">{obj.region}</TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor: 'white',
                        color: '#111827',
                        border: '1px solid #D1D5DB',
                        fontWeight: 600,
                        fontSize: '1rem',
                      }}
                    >
                      {resourceTypeLabels[obj.resourceType]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600 font-semibold text-base">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: conditionColor }} />
                      {conditionLabel}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor: priorityInfo.color + '20',
                        color: priorityInfo.color,
                        fontWeight: 600,
                        fontSize: '1rem',
                      }}
                    >
                      {priorityInfo.level}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedObject && (
        <ObjectCardModal object={selectedObject} onClose={() => setSelectedObject(null)} />
      )}
    </div>
  );
}
