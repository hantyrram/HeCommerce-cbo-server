/**
 * @memberof middlewares
 * @type {typedefs~middleware}
 * @func handleNonXHR
 * @desc Checks if a request is made thru ajax(XMLHttpRequest)or http. This middleware checks the req.xhr property.
 */
module.exports = handleNonXHR = (req,res,next)=>{
 console.log('Req XHR',req.xhr)
 if(!req.xhr){
  res.status(200).send('Hello Welcome To HT Commerce');
  return;
 }
 next();
}