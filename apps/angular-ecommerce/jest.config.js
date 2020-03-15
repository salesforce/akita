module.exports = {
  name: 'angular-ecommerce',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/angular-ecommerce',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
