// components/map/MapContainerComponent.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { format } from 'date-fns';

import type { MapObject } from '../../types/maps';
import { getCustomIcon, isWaterQuality, isRiverLevel } from '../../types/maps';

interface MapContainerComponentProps {
  sortedFilteredObjects: MapObject[];
  selectedObject: MapObject | null;
  setSelectedObject: (obj: MapObject | null) => void;
}

// Плавный полёт к выбранному объекту
function FlyToMarker({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, {
        duration: 1.8,
        easeLinearity: 0.25,
      });
    }
  }, [center, map]);
  return null;
}

export default function MapContainerComponent({
  sortedFilteredObjects,
  selectedObject,
  setSelectedObject,
}: MapContainerComponentProps) {
  return (
    <MapContainer
      center={[48.0, 68.0]}
      zoom={6}
      className="h-full w-full"
      zoomControl={true}
      scrollWheelZoom={true}
      style={{ background: '#f0f7ff' }}
    >
      {/* === БАЗОВЫЕ СЛОИ === */}
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Спутниковый (ESRI)">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="© Esri"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Стандартный (OSM)">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Топография">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="© Esri"
          />
        </LayersControl.BaseLayer>

        {/* === КАЧЕСТВО ВОДЫ === */}
        <LayersControl.Overlay checked name="Качество воды">
          <LayerGroup>
            {sortedFilteredObjects.filter(isWaterQuality).map((obj) => (
              <Marker
                key={obj.id}
                position={[obj.lat, obj.lng]}
                icon={getCustomIcon(obj)}
                eventHandlers={{
                  click: () => setSelectedObject(obj),
                }}
              >
                <Popup offset={[0, -12]}>
                  <div className="p-4 max-w-xs">
                    <p className="font-bold text-lg leading-tight">
                      {obj.description.split('\r')[0]}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {obj.parameters.length > 0
                        ? `${obj.parameters[0].parameter}: ${obj.parameters[0].concentration} ${obj.parameters[0].unit}`
                        : 'Нет данных по загрязнению'}
                    </p>
                    <p className="text-xs text-blue-600 mt-3 font-medium">
                      → Нажмите для полной карточки
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>

        {/* === УРОВНИ ВОДЫ (реальное время) === */}
        <LayersControl.Overlay checked name="Уровни воды (реальное время)">
          <LayerGroup>
            {sortedFilteredObjects.filter(isRiverLevel).map((obj) => (
              <Marker
                key={obj.id}
                position={[obj.lat, obj.lng]}
                icon={getCustomIcon(obj)}
                eventHandlers={{
                  click: () => setSelectedObject(obj),
                }}
              >
                <Popup offset={[0, -12]}>
                  <div className="p-4 text-center">
                    <p className="font-bold text-lg">{obj.object_name}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {obj.actual_level_cm} <span className="text-sm">см</span>
                    </p>
                    {obj.danger_level_cm && (
                      <p className="text-sm mt-1">
                        Опасный уровень:{' '}
                        <span className="font-bold text-red-600">{obj.danger_level_cm} см</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-3">
                      {format(new Date(obj.date), 'dd.MM.yyyy HH:mm')}
                    </p>
                    <p className="text-xs text-blue-600 mt-3 font-medium">
                      → Нажмите для деталей
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>

      {/* Плавный полёт к объекту */}
      {selectedObject && (
        <FlyToMarker
          center={[
            selectedObject.lat,
            'lng' in selectedObject ? selectedObject.lng : selectedObject, // lng у обоих типов
          ]}
        />
      )}
    </MapContainer>
  );
}