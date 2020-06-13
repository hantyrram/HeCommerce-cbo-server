const express = require('express');
const path = require('path');

module.exports = expressStatic = express.static(path.resolve(process.cwd(),'tempImages'));