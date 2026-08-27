import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: ["./src/**/*.{ts,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			canvas: '#f4efe6',
  			surface: '#fbf7f1',
  			ink: '#171410',
  			muted: '#6d655d',
  			line: 'rgba(23, 20, 16, 0.12)',
  			sky: '#6b98b5',
  			clay: '#c8857b',
  			honey: '#d2926f',
  			// Dark mode surfaces
  			'surface-dark': '#2a2622',
  			'canvas-dark': '#1f1c19',
  		},
  		fontFamily: {
  			display: [
  				'var(--font-instrument-serif)',
  				'Georgia',
  				'serif'
  			],
  			sans: [
  				'var(--font-satoshi)',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		boxShadow: {
  			soft: '0 18px 60px rgba(23, 20, 16, 0.08)',
  			glow: '0 0 0 1px rgba(23, 20, 16, 0.08), 0 24px 80px rgba(107, 152, 181, 0.12)'
  		},
  		borderRadius: {
  			xl2: '1.5rem',
  			xl3: '2rem'
  		},
  		backgroundImage: {
  			grain: 'radial-gradient(circle at 1px 1px, rgba(23,20,16,0.08) 1px, transparent 0)',
  			hero: 'radial-gradient(circle at 20% 20%, rgba(107,152,181,0.16), transparent 32%), radial-gradient(circle at 80% 10%, rgba(200,133,123,0.18), transparent 28%), radial-gradient(circle at 50% 90%, rgba(210,146,111,0.14), transparent 26%)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
};

export default config;
