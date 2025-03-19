/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{html,ts}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'brand-blue': {
          950: 'hsl(var(--brand-blue-950))',
          DEFAULT: 'hsl(var(--brand-blue))',
          foreground: 'hsl(var(--brand-blue-foreground))',
        },
        'brand-red': {
          100: 'hsl(var(--brand-red-100))',
          DEFAULT: 'hsl(var(--brand-red))',
          foreground: 'hsl(var(--brand-red-foreground))',
          dark: 'hsl(var(--brand-red-dark))',
          gradient: 'hsl(var(--brand-red-gradient))',
        },
        'brand-green': {
          500: 'hsl(var(--brand-green-500))',
          800: 'hsl(var(--brand-green-800))',
          900: 'hsl(var(--brand-green-900))',
          DEFAULT: 'hsl(var(--brand-green))',
          foreground: 'hsl(var(--brand-green-foreground))',
          dark: 'hsl(var(--brand-green-dark))',
        },
        'brand-orange': {
          100: 'hsl(var(--brand-orange-100))',
          800: 'hsl(var(--brand-orange-800))',
          900: 'hsl(var(--brand-orange-900))',
          DEFAULT: 'hsl(var(--brand-orange))',
          foreground: 'hsl(var(--brand-orange-foreground))',
          dark: 'hsl(var(--brand-orange-dark))',
          gradient: 'hsl(var(--brand-yellow-gradient))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: 0,
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: 0,
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
