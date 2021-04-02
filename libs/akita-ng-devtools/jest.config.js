module.exports = {
  name: 'akita-ng-devtools',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/akita-ng-devtools',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
