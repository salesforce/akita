/* eslint-disable */
export default {
  displayName: 'akita',
  preset: '../../jest.preset.js',
  globals: {},
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]s?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        isolatedModules: true,
      },
    ],
  },

  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/packages/akita',
};
