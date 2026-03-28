/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
      "./index.html",
      "./src/**/*.{ts,tsx,js,jsx}",
    ],
  theme: {
  	extend: {
  		fontFamily: {
  			heading: [
  				'Manrope',
  				'sans-serif'
  			],
  			body: [
  				'Work Sans',
  				'sans-serif'
  			]
  		},
  		colors: {
			border: "#bfcaba", /* outline-variant */
			input: "#e2e3df", /* surface-container-highest */
			ring: "#0d631b", /* primary */
			background: "#faf9f5", /* surface */
			foreground: "#1a1c1a", /* on-surface */
			muted: {
				DEFAULT: "#eeeeea", /* surface-container */
				foreground: "#40493d", /* on-surface-variant */
			},
			accent: {
				DEFAULT: "#f4f4f0", /* surface-container-low */
				foreground: "#1a1c1a",
			},
			popover: {
				DEFAULT: "#ffffff",
				foreground: "#1a1c1a",
			},
			card: {
				DEFAULT: "#ffffff",
				foreground: "#1a1c1a",
			},
			primary: {
				DEFAULT: '#0d631b',
				container: '#2e7d32',
				fixed: '#a3f69c',
			},
			secondary: {
				DEFAULT: '#7a5649',
				container: '#fdcdbc',
				fixed: '#ffdbcf',
			},
			surface: {
				DEFAULT: '#faf9f5',
				container: {
					lowest: '#ffffff',
					low: '#f4f4f0',
					DEFAULT: '#eeeeea',
					high: '#e8e8e4',
					highest: '#e2e3df',
				},
				variant: '#e2e3df',
			},
			on: {
				surface: '#1a1c1a',
				surfaceVariant: '#40493d',
				tertiaryContainer: '#edf4e5'
			},
			tertiary: {
				fixed: '#dee5d6',
				container: '#697064',
			},
			error: {
				DEFAULT: '#ba1a1a',
				container: '#ffdad6',
			},
			outline: {
				variant: '#bfcaba',
			}
  		},
  		boxShadow: {
  			ambient: '0px 12px 32px rgba(26, 28, 26, 0.06)'
  		},
  		borderRadius: {
  			xl: '0.75rem',
  			full: '9999px'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

