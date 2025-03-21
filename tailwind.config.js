/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/ui/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            animation: {
                'bounce-short': 'bounce 0.5s ease-in-out 1',
            },
            typography: {
                DEFAULT: {
                    css: {
                        color: '#D4A6A6',
                        'code::before': {
                            content: '""'
                        },
                        'code::after': {
                            content: '""'
                        },
                        code: {
                            color: '#D4A6A6',
                            backgroundColor: '#3A2525',
                            paddingLeft: '4px',
                            paddingRight: '4px',
                            paddingTop: '2px',
                            paddingBottom: '2px',
                            borderRadius: '4px',
                        },
                        pre: {
                            backgroundColor: '#1E1E1E',
                            color: '#D4A6A6',
                        },
                        a: {
                            color: '#D4A6A6',
                            '&:hover': {
                                color: '#FFFFFF',
                            },
                        },
                    },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
