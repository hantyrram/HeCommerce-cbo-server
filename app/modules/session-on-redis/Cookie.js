
/**
 * The session cookie
 * @memberof Session
 * @inner
 * @constructor
 * @param {Object} options - Cookie options.
 * @param {string} options.name - The name that will be used for the cookie.
 * @param {string} options.expires - The value for the expires/Max-Age cookie property.
 * @param {string} options.path - The value for the path cookie property.
 * @param {boolean} options.httpOnly - The value for the http cookie property.
 * @param {boolean} options.secure - The value for the secure cookie property.
 * @param {boolean} options.domain - The value for the domain cookie property.
 */
class Cookie{
  constructor(options){
    this.name = options.name;
    this.expires = options.expires;
    this.path = options.path;
    this.sameSite = options.sameSite;
    this.http = options.httpOnly;
    this.secure = options.secure;
    this.domain = options.domain;
    //
    //this[this.name] = value of the cookie
  }

  /**
   * @return {string} - The cookie string.
   */
  toString(){
    let arr =  Object.getOwnPropertyNames(this).reduce((acc,propertyName)=>{
      if(propertyName === 'name'){
        //skip
        return acc;
      }
      if(!this[propertyName]){
        return acc;
      }
      //cookie name,insert as first element, h_sid=jkljfsldafjasf
      if(propertyName === this.name){
        acc.unshift(`${propertyName}=${this[propertyName]}`);
        return acc;
      }
      //use Max-Age on set cookie
      acc.push(`${propertyName === 'expires'? 'Max-Age': propertyName}=${this[propertyName]}`);

      return acc;
    },[]);

    return arr.join(';');
  }
}

module.exports = Cookie;