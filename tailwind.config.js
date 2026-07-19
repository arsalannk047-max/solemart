/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0D',
        surface: '#FFFFFF',
        surfacealt: '#F5F5F7',
        volt: '#C6FF4D',
        voltink: '#17210A',
        crimson: '#E63950',
        azure: '#3D7CFF',
        muted: '#6B6F76',
        line: '#E4E4E7'
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)']
      },
      boxShadow: {
        volt: '0 6px 0 #94C400',
        card: '0 1px 2px rgba(11,11,13,0.06), 0 8px 24px rgba(11,11,13,0.06)'
      },
      clipPath: {
        cut: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)'
      }
    }
  },
  plugins: []
};
