const uuidv4 = require('uuid/v4');//connect session
const {encrypt,decrypt} = require('./sessionCipher');

/**
 * Session ID generator
 */
function *genuuidV4(){
 yield uuidv4();
}

/**
 * @param {redisC} - The redis client.
 */
module.exports = (redisC)=>{

 class Session{
  constructor(id){
    this.id = id || genuuidV4().next().value;
  }
 
  /**
   * 
   * @param {object} res - The response object.
   * @param {Cookie} cookie 
   */
  async setCookie(res,cookie){
    //encrypt cookie value here
    this.cookie = cookie;
    this.cookie[this.cookie.name] = await encrypt(this.id);//U_SID = encrypted session id
    res.setHeader('Set-Cookie',this.cookie.toString());
  }
 
  save(){
    redisC.hmset(this.id,'session',JSON.stringify(this),redisC.print);
    if(this.expire){
      redisC.expire(this.id,this.expire);
    }
    
  }
 
  /**
   * updates the expiry
   */
  refresh(){
    if(this.expire){
      redisC.expire(this.id,this.expire);
    }
  }

  destroy(){
    redisC.del(this.id,function(err,res){
      console.log('@session @destroy',{res});
    });
  }
 }

 //expire on redis
 Object.defineProperty(Session.prototype,'expire',{
   set(e){this.e = e},
   get(){return this.e},
   enumerable: false
 });

  /**
   * Resolves a Session instance with ID equals to the sessionID passed if the sessionID is found on the store.
   * Otherwise resolves a null value,meaning the sessionID is not on the redis server.
   * 
   * @param {string} sid - The encrypted cookie sent by the browser and we get from the request.
   */
  Session.find = async function(sid){
    let sessionID = await decrypt(sid);
    return new Promise((resolve,reject)=>{
      redisC.hgetall(sessionID,(err,reply)=>{
        if(reply !== null){
          let savedSession = JSON.parse(reply['session']);
          let session = new Session(sessionID);
          session.cookie = savedSession.cookie;
          session.user = savedSession.user;
          resolve(session);
        }
        resolve(null);
      })
      });
  }
  return Session;

}