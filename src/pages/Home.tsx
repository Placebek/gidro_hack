import { motion } from 'framer-motion';
import {  Droplets, BarChart3, Shield, MapPin, TriangleAlert } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function Home() {
    const router = useNavigate();
    
    const features = [
        {
            icon: <Droplets className="w-8 h-8" />,
            title: "Мониторинг в реальном времени",
            desc: "Данные обновляются каждые 6 часов с датчиков и спутников",
        },
        {
            icon: <TriangleAlert  className="w-8 h-8" />,
            title: "Ранняя система оповещения",
            desc: "Автоматические уведомления о рисках затопления и засухи",
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Аналитика и прогнозы",
            desc: "Прогнозы уровня воды на 7–30 дней с точностью до 94%",
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Оценка состояния ГТС",
            desc: "Автоматическая классификация гидротехнических сооружений",
        },
    ];

    return (
        <>
            <section
                id="hero-section"
                style={{
                    position: "relative",
                    height: "640px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    marginTop: "5rem",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom right, #e1fdff, #ffffff, #DBEAFE)",
                    }}
                    className='bg-[#e1fdff]'
                ></div>
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.3,
                    }}
                >
                    <svg
                        style={{ width: "100%", height: "100%" }}
                        viewBox="0 0 1440 640"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#2B80FF"
                            fillOpacity="0.1"
                            d="M0,320L48,298.7C96,277,192,235,288,229.3C384,224,480,256,576,261.3C672,267,768,245,864,234.7C960,224,1056,224,1152,234.7C1248,245,1344,267,1392,277.3L1440,288L1440,640L1392,640C1344,640,1248,640,1152,640C1056,640,960,640,864,640C768,640,672,640,576,640C480,640,384,640,288,640C192,640,96,640,48,640L0,640Z"
                        ></path>
                        <path
                            fill="#2B80FF"
                            fillOpacity="0.05"
                            d="M0,416L48,405.3C96,395,192,373,288,378.7C384,384,480,416,576,416C672,416,768,384,864,368C960,352,1056,352,1152,368C1248,384,1344,416,1392,432L1440,448L1440,640L1392,640C1344,640,1248,640,1152,640C1056,640,960,640,864,640C768,640,672,640,576,640C480,640,384,640,288,640C192,640,96,640,48,640L0,640Z"
                        ></path>
                    </svg>
                </div>
                <div
                    style={{
                        position: "relative",
                        zIndex: 10,
                        textAlign: "center",
                        maxWidth: "1024px",
                        padding: "0 2rem",
                    }}
                >
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(4px)",
                            borderRadius: "9999px",
                            marginBottom: "1.5rem",
                            border: "1px solid #f3f3f3",
                        }}
                    >
                        <div
                            style={{
                                width: "0.5rem",
                                height: "0.5rem",
                                backgroundColor: "#10B981",
                                borderRadius: "50%",
                                animation: "pulse 2s infinite",
                            }}
                        ></div>
                        <span
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                color: "#4B5563",
                            }}
                        >
                            Онлайн мониторинг водных ресурсов
                        </span>
                    </div>
                    <h1
                        style={{
                            fontSize: "3.75rem",
                            fontWeight: 700,
                            color: "#111827",
                            marginBottom: "1.5rem",
                            lineHeight: 1.2,
                        }}
                    >
                        ГидроАтлас — состояние
                        <br />
                        водных ресурсов Казахстана
                    </h1>
                    <p
                        style={{
                            fontSize: "1.25rem",
                            color: "#4B5563",
                            marginBottom: "2.5rem",
                            maxWidth: "32rem",
                            marginLeft: "auto",
                            marginRight: "auto",
                            lineHeight: 1.6,
                        }}
                    >
                        Интерактивная ГИС-платформа для мониторинга водных объектов и гидротехнических сооружений республики
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                        <button
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
                                transition: "all 0.3s",
                            }}
                        >
                            <i style={{ marginRight: "0.5rem" }}>
                                <svg
                                    className="svg-inline--fa fa-map-location-dot"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="map-location-dot"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    style={{ width: "20px", height: "20px", color: "white" }}
                                >
                                    <path
                                        fill="currentColor"
                                        d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                                    ></path>
                                </svg>
                            </i>
                            Открыть карту
                        </button>
                        <button
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
                            }}
                        >
                            <i style={{ marginRight: "0.5rem" }}>
                                <svg
                                    className="svg-inline--fa fa-circle-play"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="circle-play"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    style={{ width: "20px", height: "20px", color: "#4B5563" }}
                                >
                                    <path
                                        fill="currentColor"
                                        d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"
                                    ></path>
                                </svg>
                            </i>
                            Смотреть демо
                        </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginTop: "4rem" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#2B80FF", marginBottom: "0.25rem" }}>
                                2,847
                            </div>
                            <div style={{ fontSize: "0.875rem", color: "#4B5563" }}>Водных объектов</div>
                        </div>
                        <div style={{ width: "1px", height: "3rem", backgroundColor: "#E5E7EB" }}></div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#2B80FF", marginBottom: "0.25rem" }}>
                                1,523
                            </div>
                            <div style={{ fontSize: "0.875rem", color: "#4B5563" }}>Гидросооружений</div>
                        </div>
                        <div style={{ width: "1px", height: "3rem", backgroundColor: "#E5E7EB" }}></div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#2B80FF", marginBottom: "0.25rem" }}>
                                98.5%
                            </div>
                            <div style={{ fontSize: "0.875rem", color: "#4B5563" }}>Актуальность данных</div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Почему выбирают ГидроАтлас
                        </h2>
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
            </section>

            {/* Mini Map Preview */}
            <section className="py-24 bg-linear-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Готовая интерактивная карта
                        </h2>
                        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                            Все водные объекты, плотны, каналы и датчики — в одном месте
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group max-w-5xl mx-auto"
                            onClick={() => router('/map')}
                        >
                            <div className="bg-linear-to-br from-[#2B80FF] to-[#1e40af] h-96 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all" />

                                {/* Заглушка карты (можно заменить на реальное изображение) */}
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
            </section>
        </>
    );
}
