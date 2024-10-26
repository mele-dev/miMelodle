import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [require("@spartan-ng/ui-core/hlm-tailwind-preset")],
    content: ["./src/**/*.{html,ts}", "./libs/ui/**/*.{html,ts}"],
    darkMode: "selector",
    theme: {
        extend: {},
    },
    plugins: [typography, forms({ strategy: "class" })],
};
