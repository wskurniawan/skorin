const Auth = require('express').Router();

const account = require('./../account');

//base /auth
Auth.get('/', function(req, res, next){
   var id = req.query.id;

   if(!id){
      return res.render('unauthorized');
   }

   account.getDetail(id).then(result => {
      var role = result.role;

      res.cookie('session', result.id);

      if(role === 'teacher'){
         res.redirect('/teacher/dashboard');
      }else if(role === 'student'){
         res.redirect('/student/dashboard');
      }
   }).catch(error => {
      res.render('unauthorized');
   })
});

Auth.get('/redirect', function(req, res, next){
   var id = req.cookies.session;

   if(!id){
      return res.render('unauthorized');
   }

   account.getDetail(id).then(result => {
      var role = result.role;

      res.cookie('session', result.id);

      if(role === 'teacher'){
         res.redirect('/teacher/dashboard');
      }else if(role === 'student'){
         res.redirect('/student/dashboard');
      }
   }).catch(error => {
      res.render('unauthorized');
   });
})

module.exports = Auth;