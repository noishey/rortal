import type { Metadata } from 'next' // Import Next.js metadata type
import { Inter } from 'next/font/google' // Import Inter font from Google Fonts
import './styles/globals.css' // Import global CSS styles
import { Providers } from './providers' // Import providers wrapper component

const inter = Inter({ subsets: ['latin'] }) // Configure Inter font with Latin subset

export const metadata: Metadata = { // Define page metadata for SEO
  title: 'Rortal', // Page title shown in browser tab
  description: 'A portal to the decentralized web', // Meta description for SEO
}

export default function RootLayout({ // Root layout component for entire app
  children, // Child components to render
}: {
  children: React.ReactNode // Type definition for children prop
}) {
  return (
    <html lang="en" suppressHydrationWarning> {/* HTML root with English language and hydration warning suppression */}
      <body className={inter.className}> {/* Body with Inter font class */}
        <Providers> {/* Wrap app with providers for Web3, React Query, etc. */}
          {children} {/* Render page content */}
        </Providers>
      </body>
    </html>
  )
}
