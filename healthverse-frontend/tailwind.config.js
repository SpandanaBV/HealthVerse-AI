/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Calm clinical teal — the brand's primary action color
        brand: {
          50: "#EEF6F4",
          100: "#D7EAE5",
          300: "#7CB8AA",
          500: "#1E8A73",
          600: "#15705C",
          700: "#0F6E56",
          800: "#0B5746",
        },
        // Warm neutral for text/background — slightly warmer than pure slate
        ink: {
          50: "#F8F8F7",
          100: "#EFEEEC",
          200: "#DEDCD8",
          400: "#9C978F",
          600: "#5C5850",
          800: "#332F2A",
          900: "#211E1B",
        },
        status: {
          pending: "#B4862B",
          confirmed: "#1E6FB4",
          completed: "#15705C",
          cancelled: "#B23B3B",
        },
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
