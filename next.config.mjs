const isStaticExport = process.env.BUILD_TARGET === 'static'
const repoName = 'bolsonaristas'

const nextConfig = {
  // Static export APENAS para GitHub Pages (BUILD_TARGET=static)
  // Vercel usa modo dinâmico completo (API routes + SSR)
  ...(isStaticExport && {
    output: 'export',
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
    trailingSlash: true,
  }),

  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.camara.leg.br' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig
