module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  modulePathIgnorePatterns: ["<rootDir>/.next"],
  testPathIgnorePatterns: ["<rootDir>/.next"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]
};
