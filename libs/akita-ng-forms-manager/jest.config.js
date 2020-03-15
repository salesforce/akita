module.exports = {
  name: 'akita-ng-forms-manager',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/akita-ng-forms-manager',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
