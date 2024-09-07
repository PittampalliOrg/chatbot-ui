const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

const withPWA = require("next-pwa")

const withPlugins = require('next-compose-plugins')

const prod = process.env.NODE_ENV === 'production'

module.exports = withPlugins(
  [
    [withBundleAnalyzer],
    [withPWA, {
      pwa: {
        disable: !prod,
        dest: 'public'
      }
    }]
  ],
  {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost"
        },
        {
          protocol: "http",
          hostname: "127.0.0.1"
        },
        {
          protocol: "https",
          hostname: "**"
        }
      ]
    },
    experimental: {
      serverComponentsExternalPackages: ["sharp", "onnxruntime-node"]
    }
  }
)