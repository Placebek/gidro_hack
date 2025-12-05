import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles } from 'lucide-react';

export default function Home() {
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
                        {/* Кнопка "Открыть карту" */}
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
                                transition: "all 0.3s ease",
                                position: "relative",
                                overflow: "hidden",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#1d6ce6";
                                e.currentTarget.style.transform = "translateY(-3px)";
                                e.currentTarget.style.boxShadow = "0 15px 25px rgba(43, 128, 255, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#2B80FF";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 10px 15px rgba(43, 128, 255, 0.3)";
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

                        {/* Кнопка "Смотреть демо" */}
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
                                transition: "all 0.3s ease",
                                position: "relative",
                                overflow: "hidden",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#f9fafb";
                                e.currentTarget.style.borderColor = "#2B80FF";
                                e.currentTarget.style.color = "#2B80FF";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(43, 128, 255, 0.15)";
                                // Меняем цвет иконки
                                const svg = e.currentTarget.querySelector("svg");
                                if (svg) {
                                    svg.style.color = "#2B80FF";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#fff";
                                e.currentTarget.style.borderColor = "#E5E7EB";
                                e.currentTarget.style.color = "#4B5563";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                                const svg = e.currentTarget.querySelector("svg");
                                if (svg) {
                                    svg.style.color = "#4B5563";
                                }
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
                                    style={{ width: "20px", height: "20px", color: "#4B5563", transition: "color 0.3s ease" }}
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
        </>
    );
}
