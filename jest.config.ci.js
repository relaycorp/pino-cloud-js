const mainJestConfig = require('./jest.config');

module.exports = Object.assign({}, mainJestConfig, {
  collectCoverageFrom: ["build/module/lib/**/*.js"],
  moduleFileExtensions: ['js'],
  preset: null,
  roots: ['build/module/lib']
});
