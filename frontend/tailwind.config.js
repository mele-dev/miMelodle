import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [
        require("@spartan-ng/ui-core/hlm-tailwind-preset"),
        require("tailwind-gradient-mask-image"),
    ],
    content: ["./src/**/*.{html,ts}", "./libs/ui/**/*.{html,ts}"],
    darkMode: "selector",
    theme: {
        extend: {
            /** Undo spartan changes to tailwind containers */
            container: {
                center: true,
                padding: "2rem",
                screens: {
                    sm: "640px",
                    md: "768px",
                    lg: "1024px",
                    xl: "1280px",
                    "2xl": "1536px",
                },
            },
        },
    },
    plugins: [typography, forms({ strategy: "class" })],
};
