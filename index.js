global.SERVER_ROOT = __dirname;


const path = require('path');
//specify path, does not work in aws ubuntu if not specified

const dotenv = require('dotenv');

dotenv.config({path: path.join(__dirname,'.env')});
require('./app/index.js');

