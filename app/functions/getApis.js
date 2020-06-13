const fs = require('fs');
const path = require('path');

let apiFiles = fs.readdirSync(path.resolve('.','../apis'));

let apis = [];

for(let name of apiFiles){
   let api = require(path.resolve('.','../apis/' + name));
   apis.push(api);
}

module.exports = apis;