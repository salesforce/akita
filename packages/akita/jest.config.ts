/* eslint-disable */
export default {
  displayName: 'akita',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      isolatedModules: true,
    },
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]s?$': 'ts-jest',
  },

  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/packages/akita',
};
