import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'CenturyFit',
  description: '100 push-ups, pull-ups, and squats every day',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CenturyFit',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#10b981',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        </head>
        <body className="antialiased">
          {children}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').then(
                      (registration) => {
                        console.log('SW registered:', registration);
                      },
                      (err) => {
                        console.log('SW registration failed:', err);
                      }
                    );
                  });
                }
              `,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}