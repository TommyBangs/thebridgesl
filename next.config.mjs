/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Force webpack instead of Turbopack to avoid WASM binding issues
  webpack: (config, { isServer }) => {
    return config
  },
}

export default nextConfig
