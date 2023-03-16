// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/**
 * Next.js + Webpack Bundle Analyzer (`next-analyzer`) wrapper function
 *
 * Set the environment variable `ANALYZE=true` to use
 */
const withAnalyzer = (await import("@next/bundle-analyzer")).default({
  enabled: process.env.ANALYZE === "true",
});

/**
 * Next.js config
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withAnalyzer(nextConfig);
