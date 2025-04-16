module.exports = {
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(axios)/)',
    ],
    moduleNameMapper: {
      // Optional: if you later want to add CSS or asset stubs
      '\\.(css|less)$': 'identity-obj-proxy',
    },
    testEnvironment: 'jsdom',
    extensionsToTreatAsEsm: ['.js'],
  };
  