/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F97316", // Tuckit orange — single accent
          hover: "#EA580C",
          light: "#FFF7ED",
          dark: "#C2410C",
        },
        brand: {
          orange: "#F97316",
          dark: "#111827",
          card: "#FFFFFF",
          muted: "#6B7280",
          border: "#E5E7EB",
          bg: "#F9FAFB",
        },
        // DESIGN.md-aligned semantic surface scale (zinc-neutral, not Intercom cream)
        surface: {
          canvas: "#F9FAFB",    // Page background — zinc-50
          '1': "#FFFFFF",       // Floating cards — pure white
          '2': "#F4F4F5",       // Alt-row / subtle tint — zinc-100
        },
        ink: {
          DEFAULT: "#18181B",   // Primary text — zinc-900
          muted: "#71717A",     // Secondary text — zinc-500
          subtle: "#A1A1AA",    // Tertiary text — zinc-400
          tertiary: "#D4D4D8",  // Disabled / footnotes — zinc-300
        },
        hairline: {
          DEFAULT: "#E4E4E7",   // Card borders — zinc-200
          soft: "#F4F4F5",      // Soft dividers — zinc-100
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // DESIGN.md type scale with paired line-height and letter-spacing
        'display-xl': ['72px', { lineHeight: '1.05', letterSpacing: '-2.0px', fontWeight: '500' }],
        'display-lg': ['56px', { lineHeight: '1.10', letterSpacing: '-1.4px', fontWeight: '500' }],
        'display-md': ['40px', { lineHeight: '1.15', letterSpacing: '-0.8px', fontWeight: '500' }],
        'headline':   ['28px', { lineHeight: '1.20', letterSpacing: '-0.5px', fontWeight: '500' }],
        'card-title': ['22px', { lineHeight: '1.25', letterSpacing: '-0.3px', fontWeight: '500' }],
        'subhead':    ['20px', { lineHeight: '1.40', letterSpacing: '-0.2px', fontWeight: '400' }],
        'body-lg':    ['18px', { lineHeight: '1.50', letterSpacing: '-0.1px', fontWeight: '400' }],
        'body':       ['16px', { lineHeight: '1.50', letterSpacing: '0px', fontWeight: '400' }],
        'body-sm':    ['14px', { lineHeight: '1.50', letterSpacing: '0px', fontWeight: '400' }],
        'caption':    ['12px', { lineHeight: '1.40', letterSpacing: '0px', fontWeight: '400' }],
        'button':     ['15px', { lineHeight: '1.20', letterSpacing: '0px', fontWeight: '500' }],
        'eyebrow':    ['14px', { lineHeight: '1.30', letterSpacing: '0px', fontWeight: '500' }],
        'mono-sm':    ['13px', { lineHeight: '1.50', letterSpacing: '0px', fontWeight: '400' }],
      },
      spacing: {
        // DESIGN.md spacing tokens (8px base unit)
        'xxs': '4px',
        'xs-space': '8px',
        'sm-space': '12px',
        'md-space': '16px',
        'lg-space': '24px',
        'xl-space': '32px',
        'xxl': '48px',
        'section': '96px',
      },
      borderRadius: {
        // DESIGN.md radius scale
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'xxl': '24px',
        'pill': '9999px',
        'full': '9999px',
      },
      boxShadow: {
        // Minimal shadows per DESIGN.md restraint
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        '2xs': '0 1px 1px 0 rgb(0 0 0 / 0.02)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'sidebar': '1px 0 3px 0 rgb(0 0 0 / 0.04)',
      },
      width: {
        'sidebar': '256px',
        'sidebar-collapsed': '64px',
      },
      keyframes: {
        'badge-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.08)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'sidebar-expand': {
          '0%': { width: '64px' },
          '100%': { width: '256px' },
        },
        'sidebar-collapse': {
          '0%': { width: '256px' },
          '100%': { width: '64px' },
        },
      },
      animation: {
        'badge-glow': 'badge-glow 2s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
