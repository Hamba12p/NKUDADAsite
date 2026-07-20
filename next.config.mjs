/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local assets only for now; add remotePatterns here if you start
    // linking gallery/blog cover images hosted elsewhere.
    unoptimized: false
  }
};

export default nextConfig;
