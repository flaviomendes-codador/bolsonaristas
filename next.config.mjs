

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.camara.leg.br' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig
