global.SERVER_ROOT = __dirname;


const path = require('path');
//specify path, does not work in aws ubuntu if not specified
console.log(path.join(__dirname,'.env'));

const dotenv = require('dotenv');

dotenv.config({path: path.join(__dirname,'.env')});

console.log('@Root Index: process.env', process.env);

require('./app/index.js');

