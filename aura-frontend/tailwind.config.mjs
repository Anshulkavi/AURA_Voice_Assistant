module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
  extend: {
    animation: {
      shimmer: 'shimmer 3s infinite',
      pulseBg: 'backgroundPulse 10s ease-in-out infinite',
      float: 'float 6s ease-in-out infinite',
      glitch: 'glitchEffect 3s infinite',
      ripple: 'ripple 4s linear infinite',
      fadeIn: 'fadeIn 1s ease-out forwards'
    },
    keyframes: {
      shimmer: {
        '0%': { transform: 'rotate(45deg) translateX(-100%)' },
        '100%': { transform: 'rotate(45deg) translateX(100%)' },
      },
      backgroundPulse: {
        '0%, 100%': { opacity: '0.5' },
        '50%': { opacity: '0.8' },
      },
      float: {
        '0%, 100%': { transform: 'translate(-50%, -50%) translateY(0)' },
        '50%': { transform: 'translate(-50%, -50%) translateY(-20px)' },
      },
      glitchEffect: {
        '0%': { transform: 'translate(0)' },
        '20%': { transform: 'translate(-2px, 2px)' },
        '40%': { transform: 'translate(2px, -2px)' },
        '60%': { transform: 'translate(-2px, -2px)' },
        '80%': { transform: 'translate(2px, 2px)' },
        '100%': { transform: 'translate(0)' },
      },
      ripple: {
        '0%': { width: '0px', height: '0px', opacity: '1' },
        '100%': { width: '500px', height: '500px', opacity: '0' },
      },
      fadeIn: {
        from: { opacity: '0', transform: 'translateY(20px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      }
    },
  }
}
,
  plugins: [],
};
