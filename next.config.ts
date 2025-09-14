import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/languages/german',
        has: [
          {
            type: 'host',
            value: 'german.(?<host>.*)',
          },
        ],
      },
      {
        source: '/',
        destination: '/languages/french',
        has: [
          {
            type: 'host',
            value: 'french.(?<host>.*)',
          },
        ],
      },
      {
        source: '/',
        destination: '/languages/spanish',
        has: [
          {
            type: 'host',
            value: 'spanish.(?<host>.*)',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
