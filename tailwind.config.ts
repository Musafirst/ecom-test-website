import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './lib/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        jamm: {
          dark: '#0C0B09',
          'dark-alt': '#171410',
          cream: '#F4EFE4',
          gold: '#C4973A',          // bright gold — accents, borders, on-DARK text
          'gold-muted': '#8B6914',
          'gold-deep': '#6E5214',   // NEW — gold text on LIGHT backgrounds (labels/kickers)
          'gold-light': '#E8D09A',
          muted: '#514C3E',         // CHANGED from #7A7060 — legible body copy on cream
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        },
      },
    },
  },
  plugins: [],
}

export default config
