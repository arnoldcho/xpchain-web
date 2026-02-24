import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0e1216',
        panel: '#151c22',
        line: '#263440',
        text: '#d9e3ea',
        mute: '#8fa5b5',
        accent: '#28c2a0',
        warn: '#efb95d'
      }
    }
  },
  plugins: []
};

export default config;
