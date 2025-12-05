import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles } from 'lucide-react';

export default function Home() {
  const [mask, setMask] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      // Предполагаем, что бэкенд возвращает { mask: "base64string", stats: { ... } }
      setMask(`data:image/png;base64,${data.mask}`);
      setStats(data.stats);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      alert('Не удалось обработать изображение. Запущен ли бэкенд?');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <motion.h1
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="text-6xl font-bold text-center my-12 bg-linear-to-r from-cyan-600 to-blue-800 bg-clip-text text-transparent"
      >
        RiverScope SOTA 2025 в твоём браузере
      </motion.h1>

      <div className="grid grid-cols-1 p- lg:grid-cols-2 gap-12">
        {/* Блок загрузки */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="upload"
          />
          <label htmlFor="upload" className="cursor-pointer block">
            <div className="border-4 border-dashed border-cyan-400 rounded-2xl h-96 flex flex-col items-center justify-center hover:border-cyan-600 transition-all duration-300">
              <Upload className="w-20 h-20 text-cyan-500 mb-6" />
              <p className="text-2xl text-gray-600 text-center px-8">
                Перетащи спутниковый снимок или кликни —<br />
                получим маску воды за 3 секунды
              </p>
            </div>
          </label>
        </div>

        {/* Результат */}
        {mask && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-3xl shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-yellow-500" />
              Результат ИИ
            </h2>

            <img
              src={mask}
              alt="Маска воды от RiverScope"
              className="w-full rounded-xl shadow-lg"
            />

            {stats && (
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-linear-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-2xl text-center">
                  <p className="text-5xl font-bold">{stats.width_avg || '?'} м</p>
                  <p className="text-xl mt-2">Средняя ширина реки</p>
                </div>

                <div className="bg-linear-to-br from-teal-500 to-cyan-600 text-white p-6 rounded-2xl text-center">
                  <p className="text-5xl font-bold">{stats.area_km2 || '?'} км²</p>
                  <p className="text-xl mt-2">Площадь водной поверхности</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}