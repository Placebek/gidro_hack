import { motion } from 'framer-motion';
import {
    Droplets, BarChart3, Shield, MapPin, TriangleAlert,
    Activity, TrendingUp, TrendingDown, Cloud, CloudRain, Sun, AlertTriangle as AlertTriangleIcon
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
    const router = useNavigate();

    const features = [
        { icon: <Droplets className="w-8 h-8" />, title: "Мониторинг в реальном времени", desc: "Данные обновляются каждые 6 часов с датчиков и спутников" },
        { icon: <TriangleAlert className="w-8 h-8" />, title: "Ранняя система оповещения", desc: "Автоматические уведомления о рисках затопления и засухи" },
        { icon: <BarChart3 className="w-8 h-8" />, title: "Аналитика и прогнозы", desc: "Прогнозы уровня воды на 7–30 дней с точностью до 94%" },
        { icon: <Shield className="w-8 h-8" />, title: "Оценка состояния ГТС", desc: "Автоматическая классификация гидротехнических сооружений" },
    ];

    // Данные для виджетов
    const yearlyStats = [
        { icon: Droplets, label: 'Водных объектов', value: '2,847', change: '+247', positive: true },
        { icon: MapPin, label: 'Области покрытия', value: '17', change: '+0', positive: true },
        { icon: AlertTriangleIcon, label: 'Активных предупреждений', value: '12', change: '-18', positive: true },
        { icon: Activity, label: 'Работающих датчиков', value: '3,452', change: '+189', positive: true },
    ];

    const sensorData = [
        { time: '00:00', level: 2.42 },
        { time: '04:00', level: 2.45 },
        { time: '08:00', level: 2.58 },
        { time: '12:00', level: 2.84 },
        { time: '16:00', level: 2.71 },
        { time: '20:00', level: 2.59 },
        { time: '24:00', level: 2.47 },
    ];

    const currentMetrics = [
        { label: 'Уровень воды', value: '2.84 м', change: '+0.31 м', trend: 'up' },
        { label: 'Расход воды', value: '186 м³/с', change: '-12 м³/с', trend: 'down' },
        { label: 'Температура', value: '14.2°C', change: '+0.8°C', trend: 'up' },
    ];

    const forecast = [
        { day: 'Пн', icon: Sun, temp: '22°', condition: 'Ясно', precip: 0 },
        { day: 'Вт', icon: Cloud, temp: '19°', condition: 'Облачно', precip: 20 },
        { day: 'Ср', icon: CloudRain, temp: '16°', condition: 'Дождь', precip: 85 },
        { day: 'Чт', icon: CloudRain, temp: '15°', condition: 'Ливень', precip: 95 },
        { day: 'Пт', icon: Cloud, temp: '18°', condition: 'Пасмурно', precip: 30 },
    ];

    const getPrecipColor = (p: number) => p >= 70 ? 'bg-blue-600' : p >= 40 ? 'bg-blue-500' : 'bg-blue-300';

    return (
        <>
            {/* HERO SECTION — без изменений */}
            <section id="hero-section" style={{ position: "relative", height: "640px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginTop: "5rem" }}>
                {/* Весь твой герой остаётся 100% как был */}
                <div style={{ position: "absolute", inset: 0, background: "linear-linear(to bottom right, #e1fdff, #ffffff, #DBEAFE)" }} className='bg-[#e1fdff]'></div>
                <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
                    <svg style={{ width: "100%", height: "100%" }} viewBox="0 0 1440 640" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#2B80FF" fillOpacity="0.1" d="M0,320L48,298.7C96,277,192,235,288,229.3C384,224,480,256,576,261.3C672,267,768,245,864,234.7C960,224,1056,224,1152,234.7C1248,245,1344,267,1392,277.3L1440,288L1440,640L1392,640C1344,640,1248,640,1152,640C1056,640,960,640,864,640C768,640,672,640,576,640C480,640,384,640,288,640C192,640,96,640,48,640L0,640Z"></path>
                        <path fill="#2B80FF" fillOpacity="0.05" d="M0,416L48,405.3C96,395,192,373,288,378.7C384,384,480,416,576,416C672,416,768,384,864,368C960,352,1056,352,1152,368C1248,384,1344,416,1392,432L1440,448L1440,640L1392,640C1344,640,1248,640,1152,640C1056,640,960,640,864,640C768,640,672,640,576,640C480,640,384,640,288,640C192,640,96,640,48,640L0,640Z"></path>
                    </svg>
                </div>
                <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "1024px", padding: "0 2rem" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(4px)", borderRadius: "9999px", marginBottom: "1.5rem", border: "1px solid #f3f3f3" }}>
                        <div style={{ width: "0.5rem", height: "0.5rem", backgroundColor: "#10B981", borderRadius: "50%", animation: "pulse 2s infinite" }}></div>
                        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#4B5563" }}>Онлайн мониторинг водных ресурсов</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ fontSize: "3.75rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem", lineHeight: 1.2 }}
                    >
                        ГидроАтлас — состояние<br />водных ресурсов Казахстана
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }}
                        style={{ fontSize: "1.25rem", color: "#4B5563", marginBottom: "2.5rem", maxWidth: "32rem", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}
                    >
                        Интерактивная ГИС-платформа для мониторинга водных объектов...
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.4 }}
                        style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
                    >

                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 15px 25px rgba(43, 128, 255, 0.45)"
                            }}
                            transition={{ type: "spring", stiffness: 250, damping: 15 }}
                            style={{
                                padding: "1rem 2rem",
                                backgroundColor: "#2B80FF",
                                color: "#fff",
                                fontSize: "1rem",
                                fontWeight: 600,
                                borderRadius: "1rem",
                                display: "flex",
                                alignItems: "center",
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 10px 15px rgba(43, 128, 255, 0.3)",
                                transition: "all 0.3s"
                            }}
                        >
                            <i style={{ marginRight: "0.5rem" }}>
                                <svg className="svg-inline--fa fa-map-location-dot" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style={{ width: "20px", height: "20px", color: "white" }}>
                                    <path fill="currentColor" d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path>
                                </svg>
                            </i>
                            Открыть карту
                        </motion.button>
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "#F9FAFB",
                                borderColor: "#D1D5DB"
                            }}
                            transition={{ type: "spring", stiffness: 250, damping: 15 }}
                            style={{
                                padding: "1rem 2rem",
                                backgroundColor: "#fff",
                                color: "#4B5563",
                                fontSize: "1rem",
                                fontWeight: 600,
                                borderRadius: "1rem",
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #E5E7EB",
                                cursor: "pointer",
                                transition: "all 0.3s"
                            }}
                        >
                            <i style={{ marginRight: "0.5rem" }}>
                                <svg className="svg-inline--fa fa-circle-play" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: "20px", height: "20px", color: "#4B5563" }}>
                                    <path fill="currentColor" d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"></path>
                                </svg>
                            </i>
                            Смотреть демо
                        </motion.button>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { staggerChildren: 0.15, duration: 0.6 }
                            }
                        }}
                        style={{ display: "flex", justifyContent: "center", gap: "3rem", marginTop: "4rem" }}
                    >

                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#2B80FF", marginBottom: "0.25rem" }}>2,847</div>
                            <div style={{ fontSize: "0.875rem", color: "#4B5563" }}>Водных объектов</div>
                        </div>
                        <div style={{ width: "1px", height: "3rem", backgroundColor: "#E5E7EB" }}></div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#2B80FF", marginBottom: "0.25rem" }}>1,523</div>
                            <div style={{ fontSize: "0.875rem", color: "#4B5563" }}>Гидросооружений</div>
                        </div>
                        <div style={{ width: "1px", height: "3rem", backgroundColor: "#E5E7EB" }}></div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#2B80FF", marginBottom: "0.25rem" }}>98.5%</div>
                            <div style={{ fontSize: "0.875rem", color: "#4B5563" }}>Актуальность данных</div>
                        </div>
                    </motion.div>

                </div>
            </section >

            {/* Почему выбирают ГидроАтлас */}
            < section className="py-24 bg-gray-50" >
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Почему выбирают ГидроАтлас</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Современные технологии для эффективного управления водными ресурсами
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                            >
                                <div className="w-16 h-16 bg-[#2B80FF]/10 rounded-xl flex items-center justify-center text-[#2B80FF] mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* НОВАЯ СЕКЦИЯ С ВИДЖЕТАМИ — сразу после hero */}
            < section className="py-20 bg-linear-to-b from-white via-blue-50/30 to-white" >
                <div className="max-w-7xl mx-auto px-6">

                    {/* 1. Годовая сводка — на всю ширину */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-12"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Сводка за 2025 год</h3>
                        <p className="text-gray-600 mb-8">Основные показатели системы мониторинга</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {yearlyStats.map((stat, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-linear-to-br from-blue-50/70 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="p-3 w-fit bg-white rounded-xl shadow-sm mb-4">
                                        <stat.icon className="w-7 h-7 text-[#2B80FF]" />
                                    </div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <div className="flex items-end gap-2 mt-2">
                                        <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                                        <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 2 и 3. Два виджета рядом */}
                    <div className="grid lg:grid-cols-2 gap-10">

                        {/* Тренды датчиков */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <Activity className="w-6 h-6 text-[#2B80FF]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Текущие показатели</h3>
                                    <p className="text-gray-600 text-sm">За последние 24 часа</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {currentMetrics.map((m, i) => (
                                    <div key={i} className="bg-linear-to-br from-blue-50/50 to-white p-4 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-600 mb-1">{m.label}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">{m.value}</span>
                                            {m.trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-blue-600" />}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{m.change}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="h-64 -mx-8 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sensorData}>
                                        <CartesianGrid strokeDasharray="4 4" stroke="#f0f4f8" />
                                        <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                        <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                        <Tooltip contentStyle={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0' }} />
                                        <Line type="monotone" dataKey="level" stroke="#2B80FF" strokeWidth={3} dot={{ fill: '#2B80FF', r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Прогноз погоды */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <Cloud className="w-6 h-6 text-[#2B80FF]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Прогноз на 5 дней</h3>
                                    <p className="text-gray-600 text-sm">Гидрологические условия</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {forecast.map((d, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-blue-50/50 to-white border border-gray-100 hover:shadow-md transition-all"
                                    >
                                        <span className="w-10 text-gray-700 font-medium">{d.day}</span>
                                        <d.icon className="w-8 h-8 text-[#2B80FF]" />
                                        <span className="font-bold text-gray-900 w-12">{d.temp}</span>
                                        <span className="text-gray-700 flex-1">{d.condition}</span>
                                        <div className="flex items-center gap-3 w-28">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${d.precip}%` }}
                                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                                    className={`h-full ${getPrecipColor(d.precip)}`}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-600 w-10 text-right">{d.precip}%</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >



            {/* Mini Map Preview */}
            < section className="py-15 bg-linear-to-b from-white to-gray-50" >
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Готовая интерактивная карта</h2>
                        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                            Все водные объекты, плотины, каналы и датчики — в одном месте
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group max-w-5xl mx-auto"
                            onClick={() => router('/map')}
                        >
                            <div className="bg-linear-to-br from-[#2B80FF] to-[#1e40af] h-96 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all" />
                                <div className="absolute inset-0 opacity-20">
                                    <div className="w-full h-full" style={{
                                        backgroundImage: "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200')",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }} />
                                </div>
                                <div className="relative z-10 text-white">
                                    <MapPin className="w-20 h-20 mx-auto mb-6" />
                                    <p className="text-3xl font-bold mb-3">Интерактивная карта Казахстана</p>
                                    <p className="text-lg opacity-90">Нажмите, чтобы открыть полную версию</p>
                                </div>
                                <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                                    <span className="text-white font-medium">Перейти на карту →</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section >
        </>
    );
}