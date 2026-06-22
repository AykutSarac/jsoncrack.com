import type { Config } from "jest";

import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["<rootDir>/src/__tests__/*.test.{ts,tsx}"],
    testPathIgnorePatterns: [
    "/__tests__/e2e"
  ]
};

export default createJestConfig(config);