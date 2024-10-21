export default {
    theme: {
        extend: {
            fontFamily: {
                custom: ["Murecho", "Montserrat"],
            },
            colors: {
                neutral: {
                    50: "#f8f8f8",
                    750: "#363636",
                },
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
