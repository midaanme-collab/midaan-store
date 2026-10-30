import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", ".wrangler/**", "content/**", "scripts/**"],
  },
];

export default config;
