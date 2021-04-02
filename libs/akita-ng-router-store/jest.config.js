module.exports = {
  name: 'akita-ng-router-store',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/akita-ng-router-store',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
