/**
 * Generates a string of random characters based on a sample.
 * @memberof helpers 
 * @type {typedefs~helper}
 * @function randomStrGenerator
 * @param {number} length - The length of the output string.
 * @param {string} sample - The characters in which the output string will be based on.
 * @param {string} - The generated string from sample.
 */
module.exports = randomStrGenerator =(length,SAMPLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@&^$#-+')=>{
   let arr = [];
   for(let i = 0; i < length; i++){
    let index = Math.floor(Math.random() * SAMPLE.length);
    arr.push(SAMPLE[index]);
   }
   return arr.join("");
  }