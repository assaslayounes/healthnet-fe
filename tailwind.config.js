export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: { cairo: ['Cairo', 'sans-serif'], inter: ['Inter', 'sans-serif'] },
    colors: {
      background: 'hsl(var(--background))', foreground: 'hsl(var(--foreground))',
      primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))', soft: 'hsl(var(--primary-soft))' },
      muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
      border: 'hsl(var(--border))',
    },
    borderRadius: { lg: '0.75rem', xl: '1rem' },
  } },
  plugins: [require('tailwindcss-animate')],
};
