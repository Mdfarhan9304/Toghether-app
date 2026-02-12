/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#A31645', // Deep Pink/Red from Figma
                    light: '#C4175C', // Lighter variation
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: '#C4175C', // Button text color
                    foreground: '#FECDD7', // Light pink badge bg
                },
                accent: {
                    DEFAULT: '#FECDD7'
                }
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
