const fs = require("node:fs");
const path = require("node:path");

const target = process.argv[2];

const targets = {
  api: path.join(__dirname, "..", "apps", "api", "dist"),
  web: path.join(__dirname, "..", "apps", "web", ".next")
};

if (!target || !targets[target]) {
  console.error("Usage: node scripts/clean-build.js <api|web>");
  process.exit(1);
}

fs.rmSync(targets[target], { force: true, recursive: true });
