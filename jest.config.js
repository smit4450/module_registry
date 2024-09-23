/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {}], // Fixed regex to properly match .ts and .tsx files
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // Ensure these extensions are resolved
  testPathIgnorePatterns: ["/dist/"],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  }, // Uncomment if you want to ignore test paths in /dist/
  // Additional options can be added here if needed
};