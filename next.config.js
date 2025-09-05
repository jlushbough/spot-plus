/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  // Windows OneDrive compatibility fixes
  webpack: (config, { dev, isServer }) => {
    // Disable symbolic links in webpack to prevent Windows OneDrive issues
    config.resolve.symlinks = false;
    return config;
  },
};

module.exports = nextConfig;