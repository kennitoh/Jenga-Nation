/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          50: '#f8fafc',   // slate-50
          100: '#f1f5f9',  // slate-100
          200: '#e2e8f0',  // slate-200
          600: '#475569',  // slate-600
          700: '#334155',  // slate-700
          800: '#1e293b',  // slate-800
          900: '#0f172a',  // slate-900
        },

        // Accent Colors
        accent: {
          blue: {
            50: '#eff6ff',
            600: '#2563eb',
            700: '#1d4ed8',
          },
          green: {
            50: '#f0fdf4',
            600: '#16a34a',
            700: '#15803d',
          },
          red: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
          },
          orange: {
            50: '#fff7ed',
            500: '#f97316',
            600: '#ea580c',
          },
          purple: {
            50: '#faf5ff',
            500: '#9333ea',
            600: '#7c3aed',
          },
        },

        // Category Colors
        category: {
          infrastructure: {
            50: '#eff6ff',
            600: '#2563eb',
          },
          water: {
            50: '#ecfeff',
            600: '#0891b2',
          },
          healthcare: {
            50: '#faf5ff',
            600: '#9333ea',
          },
          education: {
            50: '#f0fdf4',
            600: '#16a34a',
          },
          waste: {
            50: '#fff7ed',
            600: '#f97316',
          },
          security: {
            50: '#fef2f2',
            600: '#ef4444',
          },
        }
      },

      // Background Gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563eb 0%, #16a34a 100%)',
        'gradient-main': 'linear-gradient(135deg, #f8fafc 0%, rgba(239, 246, 255, 0.3) 50%, rgba(240, 253, 244, 0.3) 100%)',
        'gradient-auth': 'linear-gradient(135deg, #eff6ff 0%, rgba(240, 253, 244, 0.5) 50%, rgba(250, 245, 255, 0.3) 100%)',
        'gradient-success': 'linear-gradient(135deg, #f0fdf4 0%, rgba(239, 246, 255, 0.3) 50%, #f8fafc 100%)',
      },

      // Typography Scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px
        'base': ['1rem', { lineHeight: '1.5' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.5' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.5' }],      // 20px
        '2xl': ['1.5rem', { lineHeight: '1.5' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '1.5' }],    // 30px
      },

      fontWeight: {
        'normal': 400,
        'medium': 500,
      },

      // Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },

      // Border Radius
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // Box Shadow
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },

      // Animation
      transitionProperty: {
        'scale': 'transform',
        'colors': 'background-color, border-color, color, fill, stroke',
      },

      scale: {
        '105': '1.05',
        '110': '1.10',
      },
    },
  },
  plugins: [],
}