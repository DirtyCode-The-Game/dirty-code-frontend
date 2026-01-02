const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
            },
            colors: {
                background: "#0a0a0a",
                foreground: "#ededed",
                primary: {
                    DEFAULT: "#00ff9d", // Neon Green
                    foreground: "#000000",
                },
                secondary: {
                    DEFAULT: "#9d00ff", // Purple
                    foreground: "#ffffff",
                },
                success: "#00ff9d",
                warning: "#f5a524",
                danger: "#f31260",
            },
            animation: {
                'pulse-slow': 'pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    darkMode: "class",
    plugins: [heroui()],
};
