/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iec: {
          blue: "#38bdf8",
          darkBlue: "#1d4ed8",
          purple: "#c026d3",
          magenta: "#e879f9",
          deep: "#050711",
        },
        brawl: {
          yellow: "#ffbe00",
          yellowDark: "#945600",
          blue: "#0088ff",
          blueDark: "#004b99",
          purple: "#c026d3",
          purpleDark: "#6b0f77",
          green: "#22c55e",
          greenDark: "#15803d",
          red: "#ef4444",
          redDark: "#991b1b",
          dark: "#0b1021",
        },
        cyber: {
          bg: "#050711",
          card: "rgba(11, 16, 33, 0.9)",
          border: "rgba(56, 189, 248, 0.3)",
          neonBlue: "#38bdf8",
          neonGreen: "#10B981",
          neonYellow: "#FACC15",
          neonRose: "#F43F5E",
          neonPurple: "#C026D3",
        }
      },
      fontFamily: {
        brawl: ['"Lilita One"', 'cursive', 'sans-serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.6))' },
          '50%': { opacity: 0.7, filter: 'drop-shadow(0 0 5px rgba(56, 189, 248, 0.2))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
