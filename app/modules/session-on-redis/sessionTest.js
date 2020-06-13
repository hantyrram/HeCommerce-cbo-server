describe('session',function(){

  describe('Cookie@toString()',function(){
    it('Provides valid cookie string',function(){
      let Session = require('./session');
      let s = new Session();
      console.log(s.cookie.toString());
    })
  });
});