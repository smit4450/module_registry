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
  
  // Added for coverage functionality
  collectCoverage: true, // Enable code coverage collection
  coverageDirectory: "coverage", // Output directory for coverage reports
  coverageReporters: ["text", "html"], // Output formats: text for terminal, html for detailed report
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}", // Collect coverage from all .ts and .tsx files in src
    "!**/node_modules/**", // Exclude node_modules
    "!**/dist/**" // Exclude dist directory
  ],
  coverageThreshold: {
    global: {
      branches: 80, // Set minimum branch coverage threshold
      functions: 80, // Set minimum function coverage threshold
      lines: 80, // Set minimum line coverage threshold
      statements: 80 // Set minimum statement coverage threshold
    }
  }
};
