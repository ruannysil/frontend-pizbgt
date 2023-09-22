import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // screens: {
    //   smartphone: '425px',
    // },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        bgdark: '#101026',
        bggreen: '#3fffa3',
        bggreenClea: '#1ea865',
        bgred: '#ff3f4b',
        bredClea: '#d34e54',
        bgdark700: '#1d1d2e',
      },
      colors: {
        placeColor: 'rgba(255,255,255, 0.8)',
        colordark: '#101026',
        bgred: '#ff3f4b',
        bggreen: '#3fffa3',
      },
    },
  },
  plugins: [],
};
export default config;
