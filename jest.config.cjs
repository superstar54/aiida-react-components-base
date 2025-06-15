// jest.config.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts','tsx','js','jsx','json','node'],
  testMatch: ['**/tests/**/*.(test|spec).(ts|tsx)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // When a test does: import { WEAS } from 'weas'
    // Jest will actually load the built CJS bundle
    '^weas$': '<rootDir>/node_modules/weas/dist/weas.cjs.js',
  }
};
