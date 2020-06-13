/**
 * ECommerce Software
 * @module htcommerce
 * @author Ronaldo Ramano
 */

const express = require('express');
const server = express();
const path  = require('path');
const SwaggerParser = require('@apidevtools/swagger-parser');

const PORT = 9090;

(async function(){
   const parser = new SwaggerParser();
   let spec =  await parser.bundle(path.join(__dirname,'app/api/index.yaml'));
   console.dir(spec);
})()

/**
 * Startup server.
 */
server.listen(PORT,function(){
   console.log(`${new Date} : [SERVER START_UP] Server started on port ${PORT}`);
});










