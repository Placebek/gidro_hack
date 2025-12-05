import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { mockObjects } from "../../data/mockObjects";
import type { ObjectFeature } from "../../types";
import { useAuthStore } from "../../store/useAuthStore";

const conditionColors: Record<number, string> = {
  1: "#22c55e",
  2: "#84cc16",
  3: "#eab308",
  4: "#f97316",
  5: "#ef4444",
};

export function MapContainer() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedObject, setSelectedObject] = useState<ObjectFeature | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [76.0, 48.0], // центр Казахстана
      zoom: 4.8,
      pitch: 45, // 3D с самого начала
      bearing: 0,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      map.current!.addSource("objects", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: mockObjects,
        },
      });

      // Основные столбики
      map.current!.addLayer({
        id: "objects-3d",
        type: "fill-extrusion",
        source: "objects",
        paint: {
          "fill-extrusion-color": [
            "match",
            ["to-number", ["get", "technical_condition"]],
            1, conditionColors[1],
            2, conditionColors[2],
            3, conditionColors[3],
            4, conditionColors[4],
            5, conditionColors[5],
            "#aaa"
          ],
          "fill-extrusion-height": [
            "*",
            ["get", "priorityScore"],
            3000
          ],
          "fill-extrusion-base": 0,
          "fill-extrusion-opacity": 0.9,
        },
      });

      // Glow-слой
      map.current!.addLayer({
        id: "objects-highlight",
        type: "fill-extrusion",
        source: "objects",
        paint: {
          "fill-extrusion-color": "#00ffff",
          "fill-extrusion-height": [
            "*",
            ["get", "priorityScore"],
            4000
          ],
          "fill-extrusion-opacity": 0,
        },
        filter: ["==", "id", ""],
      });
    });

    // Клик по объекту
    map.current.on("click", "objects-3d", (e) => {
      if (e.features && e.features[0]) {
        const feature = e.features[0] as any;
        const obj = mockObjects.find(o => o.id === feature.properties.id);

        if (obj) {
          setSelectedObject(obj);

          map.current!.flyTo({
            center: obj.geometry.coordinates as [number, number],
            zoom: 12,
            pitch: 60,
            duration: 2000,
          });
        }
      }
    });

    // Наведение курсора
    map.current.on("mouseenter", "objects-3d", () => {
      map.current!.getCanvas().style.cursor = "pointer";
    });

    map.current.on("mouseleave", "objects-3d", () => {
      map.current!.getCanvas().style.cursor = "";
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Боковая карточка */}
      {selectedObject && (
        <div className="absolute top-24 right-6 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 animate-in slide-in-from-right duration-300">
          <h3 className="text-xl font-bold text-cyan-600">
            {selectedObject.properties.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {selectedObject.properties.region}
          </p>

          <div className="mt-4 space-y-3">

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Состояние</span>

              <span
                className="font-bold px-3 py-1 rounded-full text-white text-xs"
                style={{
                  backgroundColor: conditionColors[
                    selectedObject.properties.technical_condition
                  ],
                }}
              >
                Категория {selectedObject.properties.technical_condition}
              </span>
            </div>

            {user?.role === "expert" && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Приоритет</span>
                <span
                  className={`font-bold ${
                    selectedObject.properties.priorityLevel === "Высокий"
                      ? "text-red-500"
                      : selectedObject.properties.priorityLevel === "Средний"
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}
                >
                  {selectedObject.properties.priorityLevel}
                </span>
              </div>
            )}

            <button className="w-full mt-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-medium py-3 rounded-xl hover:scale-105 transition">
              Открыть паспорт PDF
            </button>
          </div>

          <button
            onClick={() => setSelectedObject(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Легенда */}
      <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-2xl p-4 shadow-lg">
        <h4 className="font-semibold mb-3">Техническое состояние</h4>

        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: conditionColors[n] }}
              />
              <span className="text-sm">Категория {n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
