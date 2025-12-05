/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                water: {
                    50: "#F0F9FF",
                    100: "#E0F2FE",
                    500: "#0EA5E9", // основной
                    600: "#0284C7",
                    700: "#0369A1", // hover
                    900: "#1E3A8A",
                },
                // Основные цвета бренда «ГидроАтлас» – под водную тематику
                "water-blue": "#0EA5E9", // яркий голубой (как sky-500)
                "water-dark": "#0369A1", // тёмно-синий (как sky-700 / blue-700)
                "water-light": "#E0F2FE", // очень светлый фон (sky-50)
                "water-muted": "#64748B", // серый для текста
            },
            backgroundImage: {
                "water-gradient":
                    "linear-gradient(to bottom right, #0EA5E9, #0369A1)",
            },
        },
    },
    plugins: [],
};
