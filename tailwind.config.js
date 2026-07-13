/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07070c",
          900: "#0d0d16",
          800: "#141420",
          700: "#1c1c2c",
          600: "#26263a",
          500: "#33334c",
        },
        accent: {
          pink: "#ff3d81",
          magenta: "#c026d3",
          violet: "#7c3aed",
          cyan: "#22d3ee",
          gold: "#ffc857",
        },
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "aurora-1":
          "radial-gradient(circle at 20% 20%, rgba(255,61,129,0.35), transparent 55%), radial-gradient(circle at 80% 0%, rgba(124,58,237,0.35), transparent 50%), radial-gradient(circle at 50% 100%, rgba(34,211,238,0.25), transparent 55%)",
        "brand-gradient": "linear-gradient(135deg, #ff3d81 0%, #c026d3 50%, #7c3aed 100%)",
        "gold-gradient": "linear-gradient(135deg, #ffe08a 0%, #ffc857 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,61,129,0.25)",
        card: "0 8px 30px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
