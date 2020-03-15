module.exports = {
  name: 'angular-twitter-like',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/angular-twitter-like',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
