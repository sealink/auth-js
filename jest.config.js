module.exports = {
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["js"],
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.{js,jsx}"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
