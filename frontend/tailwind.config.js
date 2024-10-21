import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    darkMode: "selector",
    theme: {
        extend: {},
    },
    plugins: [typography, forms],
};
