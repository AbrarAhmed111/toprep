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
        primary: {
          DEFAULT: withOpacity('--primary'),
          hover: withOpacity('--primary-hover'),
          soft: withOpacity('--primary-soft'),
          foreground: withOpacity('--primary-foreground'),
        },
        surface: withOpacity('--surface'),
        'surface-hover': withOpacity('--surface-hover'),
        border: withOpacity('--border'),
        muted: withOpacity('--muted'),
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
          foreground: withOpacity('--danger-foreground'),
        },
        type: {
          interview: withOpacity('--type-interview'),
          exam: withOpacity('--type-exam'),
          certification: withOpacity('--type-certification'),
          custom: withOpacity('--type-custom'),
        },
        'status-skip': withOpacity('--status-skip'),
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        display: ['var(--font-display)', 'Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
