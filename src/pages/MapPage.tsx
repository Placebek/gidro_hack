import { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import Sidebar from '../components/map/Sidebar';
import MapContainerComponent from '../components/map/MapContainerComponent';
import ObjectCardMap from '../components/map/ObjectCardMap';
import type { MapObject } from '../types/maps';
import { getAllObjects, getWaterQuality } from '../store/mapStore';

export default function MapPage() {
    const [riverObjects, setRiverObjects] = useState<MapObject[]>([]);
    const [qualityObjects, setQualityObjects] = useState<MapObject[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);

    // Фильтры
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useCallback(
        debounce((value: string) => setSearchQuery(value), 300),
        [setSearchQuery]
    );

    const [filters, setFilters] = useState({
        type: 'all' as 'all' | 'quality' | 'river',
        priority: 'all' as 'all' | 'Высокий' | 'Средний' | 'Низкий',
    });



    const [selectedRegion, setSelectedRegion] = useState<number | 'all'>('all');
    const [selectedResourceType, setSelectedResourceType] = useState<number | 'all'>('all');
    const [selectedWaterType, setSelectedWaterType] = useState<number | 'all'>('all');
    const [hasFauna, setHasFauna] = useState<'all' | 'yes' | 'no'>('all');
    const [conditionCategory, setConditionCategory] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');

    // Динамическая загрузка при изменении фильтров
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const commonParams = {
                name_contains: debouncedSearchQuery || undefined,
                region_id: selectedRegion === 'all' ? undefined : selectedRegion,
                resource_type_id: selectedResourceType === 'all' ? undefined : selectedResourceType,
                water_type_id: selectedWaterType === 'all' ? undefined : selectedWaterType,
                size: 1000,
            };

            const riverParams = {
                ...commonParams,
                // Можно добавить сортировку по приоритету, если бэк поддерживает
                // sort_by_priority: true,
            };

            const qualityParams = {
                skip: 0,    
                limit: 1000,
                fauna_contains: hasFauna === 'yes' ? 'да' : hasFauna === 'no' ? 'нет' : undefined,
                // pollution_level, water_class и т.д. — добавишь позже
            };

            const [riverRes, qualityRes] = await Promise.all([
                filters.type !== 'quality' ? getAllObjects(riverParams) : Promise.resolve({ items: [] }),
                filters.type !== 'river' ? getWaterQuality(qualityParams) : Promise.resolve([]),
            ]);

            const riverMapped: MapObject[] = (riverRes.items || []).map((o: any) => ({
                id: `river-${o.id}`,
                name: o.name,
                region: o.region,
                region_id: o.region_id,
                resource_type_id: o.resource_type_id,
                water_type_id: o.water_type_id,
                technical_condition: o.technical_condition,
                passport_date: o.passport_date,
                latitude: o.latitude,
                longitude: o.longitude,
                actual_level_cm: o.actual_level_cm,
                danger_level_cm: o.danger_level_cm,
                
                actual_discharge_m3s: o.actual_discharge_m3s,
                water_temperature_C: o.water_temperature_C,
                source: 'river' as const,
            }));
            
            const qualityMapped: MapObject[] = (qualityRes || []).map((o: any) => ({
                id: `quality-${o.id}`,
                latitude: o.lat,
                fauna: o.fauna,
                purpose: o.purpose,
                water_class: o.water_class,
                description: o.description,
                longitude: o.lng,
                parameters: o.parameters || [],
                source: 'quality' as const,
            }));

            setRiverObjects(riverMapped);
            setQualityObjects(qualityMapped);
        } catch (err) {
            console.error('Ошибка загрузки данных:', err);
        } finally {
            setLoading(false);
        }
    }, [
        debouncedSearchQuery,
        filters.type,
        selectedRegion,
        selectedResourceType,
        selectedWaterType,
        hasFauna,
    ]);

    // Запускаем при изменении фильтров
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Объединяем и сортируем по приоритету (на фронте, т.к. бэк пока не умеет)
    const allFilteredObjects = useMemo(() => {
        const objects = filters.type === 'quality' ? qualityObjects :
            filters.type === 'river' ? riverObjects :
                [...riverObjects, ...qualityObjects];

        return objects.sort((a, b) => {
            const priority = (obj: any) => {
                if (!obj.technical_condition) return 0;
                const conditionScore = (6 - obj.technical_condition) * 3;
                const ageScore = obj.passport_date ? new Date().getFullYear() - new Date(obj.passport_date).getFullYear() : 15;
                return conditionScore + ageScore;
            };
            return priority(b) - priority(a);
        });
    }, [riverObjects, qualityObjects, filters.type]);

    return (
        <div className="relative h-screen flex overflow-hidden">
            <div className='z-40'>

                <Sidebar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filters={filters}
                    setFilters={setFilters}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    selectedResourceType={selectedResourceType}
                    setSelectedResourceType={setSelectedResourceType}
                    selectedWaterType={selectedWaterType}
                    setSelectedWaterType={setSelectedWaterType}
                    hasFauna={hasFauna}
                    setHasFauna={setHasFauna}
                    conditionCategory={conditionCategory}
                    setConditionCategory={setConditionCategory}
                    sortedFilteredObjects={allFilteredObjects}
                    setSelectedObject={setSelectedObject}
                />
            </div>

            <div className="flex-1 z-10">
                {loading && (
                    <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl">
                            <p className="text-lg font-medium">Загрузка объектов...</p>
                        </div>
                    </div>
                )}
                <MapContainerComponent
                    sortedFilteredObjects={allFilteredObjects}
                    selectedObject={selectedObject}
                    setSelectedObject={setSelectedObject}
                />
            </div>

            <div className='z-40'>

                <ObjectCardMap
                    selectedObject={selectedObject}
                    setSelectedObject={() => setSelectedObject(null)}
                    handleOpenPassport={() => alert('Паспорт будет доступен позже')}
                />
            </div>
        </div>
    );
}