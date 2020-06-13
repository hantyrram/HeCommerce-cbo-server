const Rule = require('./Rule');
/**
 *@class
 *@classdesc Contains a collection of rules.
 */
class Policy{
  constructor(){
    //Stores the Rules, unique by Rule.name
    this.rules = [];
  }

  /**
   * Adds a Rule to the Policy.
   * @param {Rule} rule 
   */
  addRule(rule){
    if(!(rule instanceof Rule)){
      throw new TypeError('Argument should be of type Rule');
    }
    if(this.findRule(rule) !== -1){//Rule does not yet exist
      this.rules.push(rule);
    }
  }

  /**
   * Removes the Rule from the Policy.
   * @param {Rule} rule 
   */
  removeRule(rule){
    if(!(rule instanceof Rule)){
      throw new TypeError('Argument should be of type Rule');
    }
    let i = this.findRule(rule);
    this.rules.splice(i,1);
  }

  /**
   * Finds a rule.
   * @param {Rule} rule 
   * @return {number} - The index of the rule in this Policy's Rule collections.
   */
  findRule(rule){
    let i = this.rules.findIndex((r)=>{
      return r.name === rule.name;
    });
    return i;
  }
}

module.exports = Policy;