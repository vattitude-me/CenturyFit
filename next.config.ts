import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Headers for PWA and service worker
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },
  // Redirect trailing slashes
  trailingSlash: false,
}

export default nextConfig