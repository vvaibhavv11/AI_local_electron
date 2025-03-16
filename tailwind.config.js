/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/ui/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            animation: {
                'bounce-short': 'bounce 0.5s ease-in-out 1',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
