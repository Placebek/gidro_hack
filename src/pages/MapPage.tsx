// app/map/page.tsx
'use client';

import { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';

import Sidebar from '../components/map/Sidebar';
import MapContainerComponent from '../components/map/MapContainerComponent';
import ObjectCard from '../components/map/ObjectCard';

import waterQualityData from '../data/waterQuality.json';
import riverLevelsData from '../data/riverLevels.json';

import type { MapObject } from '../types/maps';
import { getPriorityLevel } from '../types/maps';

export default function MapPage() {
    // Добавляем ID
    const waterQualityPoints: MapObject[] = waterQualityData.map((item: any, i) => ({
        ...item,
        id: `quality-${i}`,
    }));

    const riverLevelPoints: MapObject[] = riverLevelsData.map((item: any, i) => ({
        ...item,
        id: `river-${i}`,
    }));

    const allObjects: MapObject[] = [...waterQualityPoints, ...riverLevelPoints];

    const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        type: 'all' as 'all' | 'quality' | 'river',
        priority: 'all' as 'all' | 'Высокий' | 'Средний' | 'Низкий',
    });

    // Фильтрация
    const filteredObjects = useMemo(() => {
        return allObjects.filter((obj) => {
            const name = 'object_name' in obj ? obj.object_name : obj.description.split('\r')[0];
            if (searchQuery && !name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

            if (filters.type === 'quality' && !('actual_level_cm' in obj)) return false;
            if (filters.type === 'river' && !('actual_level_cm' in obj)) return false;

            return true;
        });
    }, [allObjects, searchQuery, filters]);

    // Сортировка по приоритету
    const sortedObjects = useMemo(() => {
        return [...filteredObjects].sort((a, b) => {
            const prioA = getPriorityLevel(a);
            const prioB = getPriorityLevel(b);
            const order = { Высокий: 3, Средний: 2, Низкий: 1 };
            return order[prioB] - order[prioA];
        });
    }, [filteredObjects]);

    const handleOpenPassport = () => {
        alert('Паспорт объекта будет доступен после интеграции с ГИС');
    };

    return (
        <div className="relative h-screen flex overflow-hidden pt-20">
            <div className='z-40'>

                <Sidebar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filters={filters}
                    setFilters={setFilters}
                    sortedFilteredObjects={sortedObjects}
                    setSelectedObject={setSelectedObject}
                />
            </div>

            <div className="flex-1 z-10">
                <MapContainerComponent
                    sortedFilteredObjects={sortedObjects}
                    selectedObject={selectedObject}
                    setSelectedObject={setSelectedObject}
                />
            </div>
            <div className="z-40">
                <ObjectCard
                    selectedObject={selectedObject}
                    setSelectedObject={() => setSelectedObject(null)}
                    handleOpenPassport={handleOpenPassport}
                />
            </div>
        </div>
    );
}