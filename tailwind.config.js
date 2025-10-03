/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/views/**/*.ejs",
        "./src/public/js/**/*.js"
    ],
    theme: {
        extend: {
            colors: {
                primary: "#e91e63",   // dùng bg-primary
            },
            boxShadow: {
                primary: '0 4px 24px rgba(0, 0, 0, 0.12)'
            }
        },
    },
    plugins: [],
};
