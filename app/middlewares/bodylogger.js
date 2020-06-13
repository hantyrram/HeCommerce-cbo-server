/**
 * Logs the request body on the console.
 */
let chalk = require('chalk');

module.exports = bodylogger = (req,res,next)=>{
 console.log(chalk.yellow(req.body));  
 next();
}