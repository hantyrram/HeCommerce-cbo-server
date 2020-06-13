/**
 * Removes NONE Array embedded objects, such that an embedded object { p : { y: 1} } inside obj,
 * can be accessed as obj["p.y"].
 * 
 * @param {Object} obj 
 */
function flatten(obj){
   let result = {};
   return (function recursion(obj,prevProp){
            let names = Object.getOwnPropertyNames(obj);
            let flattenedProp;
            for(let n of names){
               flattenedProp = !prevProp? n: prevProp + "." + n;
               if(typeof obj[n] === 'object' && obj[n] !== null && !(obj[n] instanceof Array)){
                     console.log(n,' is object  ', obj[n]);

                     recursion(obj[n],flattenedProp);

               }else{
                     console.log('FlattenedProp ', flattenedProp, ' = ', obj[n]);
                     result[flattenedProp] = obj[n];
               }
            }
            return result;

         })(obj);
}

module.exports = flatten;