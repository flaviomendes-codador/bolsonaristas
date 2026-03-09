import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        // Verde Militar
        verde: {
          dim:    '#0d2010',
          muted:  '#1a3a1a',
          mid:    '#1e5c1e',
          base:   '#22863a',
          bright: '#2ea84d',
          glow:   '#4ade80',
          neon:   '#86efac',
        },
        // Dourado Brasileiro
        gold: {
          dim:    '#3d2a00',
          muted:  '#7c5500',
          base:   '#d97706',
          bright: '#f59e0b',
          light:  '#fbbf24',
          shine:  '#fde68a',
        },
        // Fundo
        bg: {
          base:     '#050805',
          surface:  '#0a110a',
          elevated: '#0f1a0f',
          overlay:  '#162016',
        },
        // Mantém compatibilidade antiga
        militar: {
          900: '#050805',
          800: '#0a110a',
          700: '#0f1a0f',
          600: '#162016',
        },
        dourado: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '10xl': ['10rem',  { lineHeight: '1' }],
        '11xl': ['12rem',  { lineHeight: '1' }],
      },
      animation: {
        'fire-flicker': 'fire-flicker 2s ease-in-out infinite',
        'ember-rise':   'ember-rise 3s ease-out infinite',
        'pulse-glow':   'pulse-glow 2s ease-in-out infinite',
        'pulse-gold':   'pulse-gold 2s ease-in-out infinite',
        'pulse-red':    'pulse-red 1.5s ease-in-out infinite',
        'float':        'float 4s ease-in-out infinite',
        'scan-line':    'scan-line 8s linear infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'slide-up':     'slide-in-up 0.6s ease forwards',
        'slide-left':   'slide-in-left 0.6s ease forwards',
        'ticker':       'ticker 30s linear infinite',
        'shake':        'shake 0.5s ease-in-out',
      },
      keyframes: {
        'fire-flicker': {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)', opacity: '0.9' },
          '25%':  { transform: 'scaleY(1.05) scaleX(0.97)', opacity: '1' },
          '50%':  { transform: 'scaleY(0.97) scaleX(1.02)', opacity: '0.95' },
          '75%':  { transform: 'scaleY(1.03) scaleX(0.98)', opacity: '1' },
        },
        'ember-rise': {
          '0%':   { transform: 'translateY(0) scale(1)',    opacity: '0.8' },
          '50%':  { transform: 'translateY(-60px) scale(0.7)', opacity: '0.5' },
          '100%': { transform: 'translateY(-120px) scale(0)', opacity: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(34,134,58,0.3)' },
          '50%':      { boxShadow: '0 0 24px rgba(34,134,58,0.7), 0 0 48px rgba(34,134,58,0.3)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(245,158,11,0.3)' },
          '50%':      { boxShadow: '0 0 24px rgba(245,158,11,0.7), 0 0 48px rgba(245,158,11,0.3)' },
        },
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(220,38,38,0.3)' },
          '50%':      { boxShadow: '0 0 24px rgba(220,38,38,0.8), 0 0 40px rgba(249,115,22,0.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'scan-line': {
          '0%':   { transform: 'translateY(-100%)', opacity: '0' },
          '10%':  { opacity: '0.04' },
          '90%':  { opacity: '0.04' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        'gradient-shift': {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'slide-in-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%':      { transform: 'rotate(-1deg)' },
          '75%':      { transform: 'rotate(1deg)' },
        },
      },
      backgroundImage: {
        'flag-gradient': 'linear-gradient(135deg, #009c3b 0%, #ffdf00 50%, #009c3b 100%)',
        'hero-gradient': 'linear-gradient(180deg, #050805 0%, #0a1a0a 40%, #0f2010 70%, #050805 100%)',
        'fire-gradient': 'linear-gradient(180deg, #fbbf24 0%, #f97316 40%, #dc2626 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
        'verde-gradient':'linear-gradient(135deg, #1e5c1e 0%, #22863a 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(15,26,15,0.9) 0%, rgba(10,17,10,0.95) 100%)',
      },
      boxShadow: {
        'verde-sm': '0 0 8px rgba(34, 134, 58, 0.3)',
        'verde-md': '0 0 20px rgba(34, 134, 58, 0.4)',
        'verde-lg': '0 0 40px rgba(34, 134, 58, 0.5)',
        'gold-sm':  '0 0 8px rgba(245, 158, 11, 0.3)',
        'gold-md':  '0 0 24px rgba(245, 158, 11, 0.6)',
        'gold-lg':  '0 0 48px rgba(245, 158, 11, 0.4)',
        'red-md':   '0 0 20px rgba(220, 38, 38, 0.5)',
        'card':     '0 4px 24px rgba(0, 0, 0, 0.6)',
        'card-lg':  '0 8px 40px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
}

export default config
