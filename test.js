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

const parser = new SwaggerParser();
(async function(){
   const api = await parser.dereference(path.join(__dirname,'app/defs/api.yaml'));
   console.dir(api,{depth: 15});
})()

/**
 * Startup server.
 */
server.listen(PORT,function(){
   console.log(`${new Date} : [SERVER START_UP] Server started on port ${PORT}`);
});










