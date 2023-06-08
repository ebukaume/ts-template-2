import { type Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: [
    'json',
    'text',
    'text-summary',
    'lcov',
    'clover'
  ],
  testMatch: [
    '**/*.spec.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ]
};

export default config;
