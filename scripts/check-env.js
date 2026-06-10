const required = [
  "MONGODB_URI",
  "JWT_SECRET",
  "AADHAAR_ENCRYPTION_KEY"
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const validNodeEnvs = new Set(["development", "production", "test"]);

if (process.env.NODE_ENV && !validNodeEnvs.has(process.env.NODE_ENV)) {
  console.error("NODE_ENV must be one of: development, production, test");
  process.exit(1);
}
