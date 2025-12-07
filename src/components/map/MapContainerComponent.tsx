'use client';

import { MapContainer, TileLayer, LayersControl, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import type { MapObject } from '../../types/maps';
import { getCustomIcon, isWaterQuality, isRiverLevel } from '../../types/maps';
import { Droplet, MapPin } from 'lucide-react';

// Фикс дефолтных иконок Leaflet в Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Props {
  sortedFilteredObjects: MapObject[];
  selectedObject: MapObject | null;
  setSelectedObject: (obj: MapObject | null) => void;
}

// Компонент плавного полёта к выбранному объекту
function FlyToMarker({ object }: { object: MapObject }) {
  const map = useMap();

  useEffect(() => {
    if (!object) return;

    const lat = 'latitude' in object ? object.latitude : object.lat || object.latitude;
    const lng = 'longitude' in object ? object.longitude : object.lng || object.longitude;

    map.flyTo([lat, lng], 15, {
      duration: 1.6,
      easeLinearity: 0.25,
    });
  }, [object, map]);

  return null;
}

export default function MapContainerComponent({
  sortedFilteredObjects,
  selectedObject,
  setSelectedObject,
}: Props) {
  const truncate = (text: string, max = 60) => text?.length > max ? text.slice(0, max) + '…' : text || '';
  const cut = (text?: string, max = 10) => {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '…' : text;
};


  return (
    <MapContainer
      center={[49.0, 65.0]}
      zoom={5}
      scrollWheelZoom={true}
      zoomControl={true}
      style={{ height: '100vh', width: '100%' }}
      fadeAnimation={false}
      zoomAnimation={false}
      markerZoomAnimation={false}
    >
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
            attribution='&copy; OpenStreetMap'
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* Все маркеры */}
      {sortedFilteredObjects.map((obj) => (
        <Marker
          key={obj.id}
          position={[obj.latitude, obj.longitude]}
          icon={getCustomIcon(obj)}
          eventHandlers={{
            click: () => setSelectedObject(obj),
          }}
        >
          {/* Tooltip при наведении */}
          <Tooltip
            direction="top"
            offset={[0, -10]}
            opacity={1}
            permanent={false}
            className="border-0 shadow-2xl"
          >
            <div className="max-w-sm px-5 py-4 bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200 shadow-2xl">
              <div className="space-y-2.5 text-sm">
                <h4 className="font-bold text-gray-900 text-base line-clamp-2">
                  {obj.name || obj.description?.split('\r')[0] || 'Без названия'}
                </h4>

                {obj.location_info && (
                  <div><span className="text-gray-500 text-xs">Местоположение:</span> {obj.location_info}</div>
                )}
                {obj.purpose && (
                  <div><span className="text-gray-500 text-xs">Назначение:</span> {cut(obj.purpose)}</div>
                )}
                {obj.fauna && obj.fauna.length > 0 && (
                  <div><span className="text-gray-500 text-xs">Фауна:</span> {Array.isArray(obj.fauna) ? obj.fauna.join(', ') : obj.fauna}</div>
                )}
                {obj.water_class !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">Класс воды:</span>
                    <span className={`px-3 py-1 rounded-full text-white font-bold text-xs
                      ${obj.water_class === 1 && 'bg-green-600'}
                      ${obj.water_class === 2 && 'bg-lime-600'}
                      ${obj.water_class === 3 && 'bg-yellow-600'}
                      ${obj.water_class === 4 && 'bg-orange-600'}
                      ${obj.water_class >= 5 && 'bg-red-600'}
                    `}>
                      {obj.water_class} класс
                    </span>
                  </div>
                )}
                {obj.actual_level_cm !== undefined && (
                  <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-xl">
                    <span className="text-blue-700 font-medium">Уровень воды</span>
                    <span className="text-xl font-bold text-blue-900">
                      {obj.actual_level_cm} <span className="text-sm">см</span>
                    </span>
                  </div>
                )}
                {obj.water_type && (
                  <div className="text-xs">
                    <span className="text-gray-500">Тип воды:</span>{' '}
                    <span className={`font-semibold ${obj.water_type === 'пресная' ? 'text-cyan-700' : 'text-amber-700'}`}>
                      {obj.water_type === 'пресная' ? 'Пресная' : 'Непресная'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Tooltip>

          {/* Popup при клике */}
          {/* <Popup offset={[0, -16]} className="custom-popup">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 px-5 py-4 min-w-[240px] backdrop-blur-xl bg-opacity-98">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <p className="font-mono text-xs text-gray-600">
                  {Number(obj.latitude).toFixed(5)}, {Number(obj.longitude).toFixed(5)}
                </p>
              </div>

              <h4 className="font-bold text-gray-900 text-base leading-tight mb-3">
                {obj.name || obj.description?.split('\r')[0] || 'Без названия'}
              </h4>

              {isRiverLevel(obj) && (
                <div className="flex items-center justify-between py-3 px-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 mb-3">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Уровень воды</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-700">
                    {obj.actual_level_cm}<span className="text-sm ml-1">см</span>
                  </span>
                </div>
              )}

              {obj.is_dangerous !== undefined && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-3
                  ${obj.is_dangerous ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'}
                `}>
                  {obj.is_dangerous ? 'Опасно!' : 'В норме'}
                </div>
              )}

              {obj.water_class !== undefined && (
                <div className="text-sm">
                  <span className="text-gray-600">Класс воды: </span>
                  <span className={`font-bold text-white px-3 py-1 rounded-full text-xs
                    ${obj.water_class === 1 && 'bg-green-600'}
                    ${obj.water_class === 2 && 'bg-lime-600'}
                    ${obj.water_class === 3 && 'bg-yellow-600'}
                    ${obj.water_class === 4 && 'bg-orange-600'}
                    ${obj.water_class >= 5 && 'bg-red-600'}
                  `}>
                    {obj.water_class} класс
                  </span>
                </div>
              )}
            </div>
          </Popup> */}
        </Marker>
      ))}

      {/* Плавный полёт к выбранному объекту */}
      {selectedObject && <FlyToMarker object={selectedObject} />}
    </MapContainer>
  );
}