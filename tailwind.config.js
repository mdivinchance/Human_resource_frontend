/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // VS Code inspired color palette
        'vscode': {
          'bg': '#ffffffff',
          'bg-light': '#ffffffff',
          'bg-lighter': '#dddcdcff',
          'sidebar': '#ffffffff',
          'border': '#c4c4c4ff',
          'text': '#000000ff',
          'text-muted': '#969696',
          'accent': '#007acc',
          'accent-hover': '#005a9e',
          'success': '#4ec9b0',
          'warning': '#ffcc02',
          'error': '#f44747',
          'info': '#75beff'
        },
        // GitHub inspired colors for forms
        'github': {
          'bg': '#eef0f3ff',
          'bg-light': '#f8f6f6ff',
          'border': '#575858ff',
          'text': '#000000ff',
          'text-muted': '#8b949e',
          'accent': '#238636',
          'accent-hover': '#2ea043',
          'button': '#21262d',
          'button-hover': '#000000ff'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'Roboto Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      boxShadow: {
        'vscode': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'github': '0 8px 24px rgba(140, 149, 159, 0.2)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
