const isProd = process.env.NODE_ENV === 'production'
const repoName = 'bolsonaristas'

const nextConfig = {
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  trailingSlash: true,
  images: {
    unoptimized: true, // obrigatório para export estático
    remotePatterns: [
      { protocol: 'https', hostname: 'www.camara.leg.br' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig
