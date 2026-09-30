module.exports = { ...{
        theme: {
          extend: {
            colors: {
              brand: {
                50: '#f0fdfa',
                100: '#ccfbf1',
                500: '#14b8a6',
                600: '#0d9488',
                900: '#134e4a',
              }
            },
            keyframes: {
              'fade-in': {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
              },
              'scale-in': {
                '0%': { transform: 'scale(0.95)', opacity: '0' },
                '100%': { transform: 'scale(1)', opacity: '1' },
              }
            },
            animation: {
              'fade-in': 'fade-in 0.3s ease-out',
              'scale-in': 'scale-in 0.2s ease-out',
            }
          }
        }
      }, content: ["./index.html", "./*.tsx", "./components/**/*.tsx"] };
