/**
 * Main service provider this MUST always be called by the application
 */
module.exports = function _main(req,res,next){
   //maybe we can execute async codes here;
   res.json({type:'message',text:'accessing root'});
}