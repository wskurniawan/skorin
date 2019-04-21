const Teacher = require('express').Router();
const shortId = require('shortid');

const InfoSoal = require('./../model/info-soal');
const Soal = require('./../model/soal');

const account = require('./../account');

//base /teacher
Teacher.use(function(req, res, next){
   var idUser = req.cookies.session;
   
   account.getDetail(idUser).then(result => {
      var role = result.role;
      if(role === 'teacher'){
         req.user = result;
         next();
      }else{
         res.render('unauthorized');
      }
   }).catch(error => {
      res.render('unauthorized');
   });
});

Teacher.get('/dashboard', function(req, res, next){
   InfoSoal.find({ id_user: req.user.id }).then(result => {
      res.render('home-teacher', { listUjian: result, user: req.user });
   }).catch(error => {
      next(error);
   })
});

Teacher.get('/add-test', function(req, res, next){
   res.render('teacher-add-test');
});

Teacher.post('/add-test', function(req, res, next){
   var infoUjian = {
      title: req.body.nama_ujian,
      description: req.body.deskripsi,
      id: shortId.generate(),
      id_user: req.user.id
   };

   InfoSoal.create(infoUjian).then(result => {
      res.redirect(req.baseUrl + '/dashboard-soal/' + infoUjian.id);
   }).catch(error => {
      next(error);
   });
});

Teacher.get('/dashboard-soal/:idSoal', function(req, res, next){
   var idSoal = req.params.idSoal;
   var infoSoal = {};
   var listSoal = [];

   InfoSoal.findOne({ id: idSoal }).then(result => {
      infoSoal = result;

      return Soal.find({ parent: idSoal });
   }).then(result => {
      listSoal = result;

      res.render('teacher-add-soal', { infoUjian: infoSoal, idSoal: idSoal, listSoal: listSoal });
   }).catch(error => {
      next(error);
   });
});

Teacher.post('/:idSoal/add-soal', function(req, res, next){
   var soal = {
      q: req.body.soal,
      a: req.body.jawaban,
      id: 'soal-' + Date.now(),
      parent: req.params.idSoal
   };

   Soal.create(soal).then(result => {
      res.redirect(req.baseUrl + '/dashboard-soal/' + req.params.idSoal);
   }).catch(error => {
      next(error);
   });
});

Teacher.get('/:idSoal/test-result', function(req, res, next){
   var idSoal = req.params.idSoal;

   res.send(idSoal);
});

module.exports = Teacher;