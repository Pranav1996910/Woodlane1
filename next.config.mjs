/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimization is on (the previous `unoptimized: true` disabled resizing,
  // format conversion, and responsive srcsets for every <Image>). Vercel's
  // image optimizer handles this for free at deploy time — no extra config
  // needed for local /public assets.
  images: {
    remotePatterns: [
      // Door photos uploaded through /admin (lib/doors-catalogue.ts) are
      // public Vercel Blob URLs at this host pattern. Without this,
      // components/catalogue-image.tsx would still work — it falls back to
      // an unoptimized <img> for any host it doesn't recognise — but these
      // are exactly the images most worth optimizing (uploaded from a phone
      // camera, arbitrary size), so it's worth allow-listing explicitly.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
}

export default nextConfig
