import type { Config } from 'tailwindcss'

function withOpacity(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),
        brand: {
          DEFAULT: withOpacity('--brand'),
          hover: withOpacity('--brand-hover'),
          foreground: withOpacity('--brand-foreground'),
        },
        surface: withOpacity('--surface'),
        'surface-2': withOpacity('--surface-2'),
        border: withOpacity('--border'),
        muted: withOpacity('--muted'),
        teal: withOpacity('--accent-teal'),
        success: {
          DEFAULT: withOpacity('--success'),
          bg: withOpacity('--success-bg'),
        },
        warning: {
          DEFAULT: withOpacity('--warning'),
          bg: withOpacity('--warning-bg'),
        },
        danger: {
          DEFAULT: withOpacity('--danger'),
          bg: withOpacity('--danger-bg'),
        },
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
