import type { NextConfig } from "next";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Generate build metadata strictly during build time (zero PII, zero credentials)
try {
  let commitSha = (
    process.env.CF_PAGES_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.COMMIT_SHA ||
    ""
  ).trim();

  if (!commitSha) {
    try {
      commitSha = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    } catch {
      commitSha = "unknown";
    }
  }

  const buildInfo = {
    commit: commitSha,
    builtAt: new Date().toISOString(),
  };

  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(publicDir, "build-info.json"),
    JSON.stringify(buildInfo, null, 2) + "\n"
  );
} catch {
  // Graceful fallback to avoid build interruptions
}

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
