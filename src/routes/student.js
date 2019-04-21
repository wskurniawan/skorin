const Student = require('express').Router();
const account = require('./../account');

const InfoUjian = require('./../model/info-soal');
const Soal = require('./../model/soal');
const Jawaban = require('./../model/jawaban');

//base /student
Student.use(function(req, res, next){
   var idUser = req.cookies.session;
   
   account.getDetail(idUser).then(result => {
      var role = result.role;
      if(role === 'student'){
         req.user = result;
         next();
      }else{
         res.render('unauthorized');
      }
   }).catch(error => {
      res.render('unauthorized');
   });
});

Student.get('/dashboard', async function(req, res, next){
   try {
      var listUjian = await Jawaban.find({ id_user: req.user.id });
   } catch (error) {
      return next(error);
   }

   console.log(listUjian);

   res.render('home-student', { user: req.user, listUjian: listUjian });
});

Student.post('/start-test', async function(req, res, next){
   var idSoal = req.body.kode_soal;
   try {
      var infoUjian = await InfoUjian.findOne({ id: idSoal });
   } catch (error) {
      return next(error);
   }

   if(!infoUjian){
      return res.send('Invalid code');
   }

   try {
      var listSoal = await Soal.find({ parent: idSoal });
   } catch (error) {
      return next(error);
   }

   console.log(listSoal);
   console.log(infoUjian);

   res.render('student-test', { infoUjian: infoUjian, listSoal: listSoal });
});

Student.post('/:idTest/submit-test', async function(req, res, next){
   var answer = req.body;
   var arrAnswer = [];

   for(var key in answer){
      arrAnswer.push(answer[key]);
   }

   try {
      var infoUjian = await InfoUjian.findOne({ id: req.params.idTest });
   } catch (error) {
      return next(error);
   }

   if(!infoUjian){
      return res.send('Invalid code');
   }

   var jawaban = {
      id_user: req.user.id,
      id_soal: req.params.idTest,
      nama_ujian: infoUjian.title,
      jawaban: arrAnswer,
      benar: 0,
      salah: 0,
      skor: 0,
      isKoreksi: false
   };

   Jawaban.create(jawaban).then(result => {
      res.redirect(req.baseUrl + '/dashboard');
   }).catch(error => {
      next(error);
   });
});

module.exports = Student;