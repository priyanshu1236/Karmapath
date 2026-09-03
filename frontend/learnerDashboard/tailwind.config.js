// /** @type {import('tailwindcss').Config} */
// export default {
//     content: [
//         "./index.html",
//         "./src/**/*.{js,ts,jsx,tsx}",
//     ],
//     theme: {
//         extend: {},
//     },
//     plugins: [],
// }
/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                  50: 'var(--color-brand-50)',
                  100: 'var(--color-brand-100)',
                  200: 'var(--color-brand-200)',
                  300: 'var(--color-brand-300)',
                  400: 'var(--color-brand-400)',
                  500: 'var(--color-brand-500)',
                  600: 'var(--color-brand-600)',
                  700: 'var(--color-brand-700)',
                  800: 'var(--color-brand-800)',
                  900: 'var(--color-brand-900)',
                  950: 'var(--color-brand-950)',
                },
                surface: {
                  50: 'var(--color-surface-50)',
                  100: 'var(--color-surface-100)',
                  200: 'var(--color-surface-200)',
                  300: 'var(--color-surface-300)',
                  400: 'var(--color-surface-400)',
                  500: 'var(--color-surface-500)',
                  600: 'var(--color-surface-600)',
                  700: 'var(--color-surface-700)',
                  800: 'var(--color-surface-800)',
                  900: 'var(--color-surface-900)',
                  950: 'var(--color-surface-950)',
                },
                success: {
                  50: 'var(--color-success-50)',
                  100: 'var(--color-success-100)',
                  200: 'var(--color-success-200)',
                  300: 'var(--color-success-300)',
                  400: 'var(--color-success-400)',
                  500: 'var(--color-success-500)',
                  600: 'var(--color-success-600)',
                  700: 'var(--color-success-700)',
                  800: 'var(--color-success-800)',
                  900: 'var(--color-success-900)',
                  950: 'var(--color-success-950)',
                },
                alert: {
                  50: 'var(--color-alert-50)',
                  100: 'var(--color-alert-100)',
                  200: 'var(--color-alert-200)',
                  300: 'var(--color-alert-300)',
                  400: 'var(--color-alert-400)',
                  500: 'var(--color-alert-500)',
                  600: 'var(--color-alert-600)',
                  700: 'var(--color-alert-700)',
                  800: 'var(--color-alert-800)',
                  900: 'var(--color-alert-900)',
                  950: 'var(--color-alert-950)',
                }
            }
        },
    },
    plugins: [],
}   