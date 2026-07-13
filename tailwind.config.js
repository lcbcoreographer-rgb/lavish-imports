/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#fff9fb",
          100: "#fff0f5",
          200: "#ffe2ec",
        },
        ink: {
          900: "#2b1f27",
          700: "#5c4653",
          500: "#8a7480",
          300: "#c9b8c1",
        },
        accent: {
          pink: "#ff3d81",
          pinkSoft: "#ff8fb8",
          magenta: "#d6478f",
          gold: "#ffc857",
        },
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "aurora-1":
          "radial-gradient(circle at 20% 10%, rgba(255,143,184,0.35), transparent 55%), radial-gradient(circle at 85% 0%, rgba(255,61,129,0.18), transparent 50%), radial-gradient(circle at 50% 100%, rgba(255,200,87,0.15), transparent 55%)",
        "brand-gradient": "linear-gradient(135deg, #ff3d81 0%, #d6478f 100%)",
        "gold-gradient": "linear-gradient(135deg, #ffe08a 0%, #ffc857 100%)",
      },
      boxShadow: {
        glow: "0 20px 60px -15px rgba(255,61,129,0.35)",
        card: "0 10px 30px -10px rgba(43,31,39,0.15)",
      },
    },
  },
  plugins: [],
};
