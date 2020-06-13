const PolicyViolation = require('./PolicyViolation');

/**
 * @class
 * @abstract
 * @classdesc A Rule represents a single rule in a Policy. It defines a certain condition that a request MUST meet.
 */
class Rule{
 
  /**
   * Inherited by subclasses.
   * Checks if the condition returns true. Invokes the child classes' condition().
   * @throws {PolicyViolation} if the call to child class' condition() yields false.
   * @param {Object} request - The request object.
   */
  check(request){

    if(this.condition(request)) {return true;}

    throw new PolicyViolation(`${this.constructor.name}!`);
  }

 /**
 * Accepts the request, and checks if certain conditions are meet by the request.
 * @abstract
 * @param {Object} request - The request object.
 * @return {boolean} - true if the request meets certain conditions defined by the rule, otherwise false.
 */
 condition(request){
  throw new Error('condition() not implemented');
 }

}


module.exports = Rule;
