/** @type {import('tailwindcss').Config} */ // TypeScript type for Tailwind config
module.exports = {
  content: [ // Files to scan for Tailwind classes
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Pages directory
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Components directory
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // App directory (Next.js 13+ app router)
  ],
  theme: { // Theme customization
    extend: { // Extend default Tailwind theme
      colors: { // Custom color palette using CSS variables
        background: 'hsl(var(--background))', // Main background color
        foreground: 'hsl(var(--foreground))', // Main text color
        card: 'hsl(var(--card))', // Card background color
        'card-foreground': 'hsl(var(--card-foreground))', // Card text color
        popover: 'hsl(var(--popover))', // Popover background
        'popover-foreground': 'hsl(var(--popover-foreground))', // Popover text
        primary: 'hsl(var(--primary))', // Primary brand color
        'primary-foreground': 'hsl(var(--primary-foreground))', // Primary text color
        secondary: 'hsl(var(--secondary))', // Secondary color
        'secondary-foreground': 'hsl(var(--secondary-foreground))', // Secondary text
        muted: 'hsl(var(--muted))', // Muted background color
        'muted-foreground': 'hsl(var(--muted-foreground))', // Muted text color
        accent: 'hsl(var(--accent))', // Accent color for highlights
        'accent-foreground': 'hsl(var(--accent-foreground))', // Accent text color
        destructive: 'hsl(var(--destructive))', // Error/danger color
        'destructive-foreground': 'hsl(var(--destructive-foreground))', // Error text
        border: 'hsl(var(--border))', // Border color
        input: 'hsl(var(--input))', // Input field border color
        ring: 'hsl(var(--ring))', // Focus ring color
      },
      backgroundImage: { // Custom gradient backgrounds
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))', // Radial gradient
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))', // Conic gradient
      },
      borderRadius: { // Custom border radius using CSS variables
        lg: 'var(--radius)', // Large border radius
        md: 'calc(var(--radius) - 2px)', // Medium border radius
        sm: 'calc(var(--radius) - 4px)', // Small border radius
      },
    },
  },
  plugins: [], // No additional Tailwind plugins
}