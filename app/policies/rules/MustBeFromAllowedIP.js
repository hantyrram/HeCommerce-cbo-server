
const whitelist = [
  "127.0.0.1"
];

      
/**
 * 
 * Checks that the origin ip address is on the whitelist.
 * @memberof rules
 * @extends Rule
 * @constructor
 * @param {Array} whitelist - The list of allowed ip address
 */
class MustBeFromAllowedIP extends global.Rule{
  
  constructor(whitelist){
   this.whitelist = whitelist;
  }
  
  get condition(){
     return (request)=>{
      console.log(request.connection.remoteAddress);
      console.log('MustBeFromAllowedIP Rule not yet implemented'); 
      return true;
    }
  }
}

module.exports = MustBeFromAllowedIP;
