import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';

export default {
    content: [],
    theme: {
        extend: {
            fontFamily: {
                custom: ['Murecho', 'Montserrat'],
            },
        },
    },
    plugins: [typography, animate],
} satisfies Config;
