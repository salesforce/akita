#!/usr/bin/env node
process.argv.push('--plopfile', __dirname + '/plopfile.js');
require('plop');
