/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,jsx,mdx}",
        "./components/**/*.{js,jsx,mdx}",
        "./app/**/*.{js,jsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Tu peux personnaliser tes couleurs ici
                primary: "#4f46e5", // Un bel indigo
                secondary: "#10b981", // Un vert émeraude
                dark: "#111827",
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
        },
    },
    plugins: [],
};