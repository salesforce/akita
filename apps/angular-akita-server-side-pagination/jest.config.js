module.exports = {
  name: 'angular-akita-server-side-pagination',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/angular-akita-server-side-pagination',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
