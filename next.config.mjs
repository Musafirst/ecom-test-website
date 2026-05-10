/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 84, 86, 88, 90, 92],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'fimgs.net',
        pathname: '/mdimg/perfume-thumbs/**',
      },
      {
        protocol: 'https',
        hostname: 'www.lattafaindia.com',
        pathname: '/cdn/shop/files/**',
      },
      {
        protocol: 'https',
        hostname: 'us.afnan.com',
        pathname: '/cdn/shop/files/**',
      },
      {
        protocol: 'https',
        hostname: 'd1ncau8tqf99kp.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd8j0ntlcm91z4.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.jbl.com',
        pathname: '/dw/image/**',
      },
      {
        protocol: 'https',
        hostname: 'image-us.samsung.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.samsung.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.bhphoto.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pisces.bbystatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mnd-assets.mynewsdesk.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.intenseoud.com',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'afnan.com',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'us.afnan.com',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'armafperfume.com',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'www.myperfumeshop.com',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
      {
        protocol: 'https',
        hostname: 'www.lattafa-usa.com',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'armaf.com',
        pathname: '/cdn/shop/**',
      },
    ],
  },
}

export default nextConfig
