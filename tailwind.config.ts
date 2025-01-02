import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
    content: [],
    theme: {
        extend: {
            fontFamily: {
                custom: ['Murecho', 'Montserrat'],
            },
        },
    },
    plugins: [typography],
} satisfies Config;
