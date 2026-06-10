const { rmSync } = require("node:fs");
const { join } = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = join(__dirname, "..");
const webRoot = join(repoRoot, "apps", "web");

const env = {
  ...process.env,
  NEXT_IGNORE_INCORRECT_LOCKFILE: "1",
  NEXT_TELEMETRY_DISABLED: "1",
  NODE_ENV: "production"
};

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env,
    shell: process.platform === "win32",
    stdio: "inherit"
  });

  return result.status === 0;
}

console.log("Render web build diagnostics");
console.log(`cwd=${process.cwd()}`);
console.log(`node=${process.version}`);
console.log(`NODE_ENV=${env.NODE_ENV}`);
console.log(`NEXT_PUBLIC_API_URL=${env.NEXT_PUBLIC_API_URL || "(not set)"}`);

run("npm", ["--version"]);

rmSync(join(webRoot, ".next"), { force: true, recursive: true });

console.log("Running Next.js production build...");
if (run("npx", ["next", "build"], { cwd: webRoot })) {
  process.exit(0);
}

console.log("Default Next.js build failed. Retrying with Webpack for Render compatibility...");
rmSync(join(webRoot, ".next"), { force: true, recursive: true });

if (run("npx", ["next", "build", "--webpack"], { cwd: webRoot })) {
  process.exit(0);
}

console.error("Web build failed with both default builder and Webpack fallback.");
process.exit(1);
