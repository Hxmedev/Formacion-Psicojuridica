import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}', // Asegura que Astro y todos los posibles archivos estén incluidos
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-0.5rem)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.3s ease-out forwards',
      },
      transitionTimingFunction: {
        'in-out-back': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Para animaciones más elásticas
      },
      scale: {
        98: '0.98',
      },
      display: {
        'group-hover': 'group-hover'
      },
      fontSize: {
        'custom-h4': '1.35em',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Puedes incluir esta si deseas usar animaciones predefinidas:
    // require('@tailwindcss/animate'),
  ],
};

export default config;
