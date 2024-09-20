/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  // limit jest search scope to src directory
  // roots: ['<rootDir>/src'],  // Restricts Jest to search for tests in the /src directory
  testPathIgnorePatterns: ["/dist/"],  // Ignore the `dist` folder
};

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   roots: ['<rootDir>/src'],  // Jest will look for tests in the /src directory
// };
