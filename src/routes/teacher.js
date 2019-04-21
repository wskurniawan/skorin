const Teacher = require('express').Router();
const shortId = require('shortid');
const axios = require('axios').default;

const InfoSoal = require('./../model/info-soal');
const Soal = require('./../model/soal');
const Jawaban = require('./../model/jawaban');

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

Teacher.get('/:idSoal/test-result', async function(req, res, next){
   var idSoal = req.params.idSoal;
   var listSubmission = [];

   try {
      var listJawaban = await Jawaban.find({ id_soal: idSoal });
      var infoUjian = await InfoSoal.findOne({ id: idSoal });

      await listJawaban.map(async function(item, index){
         var user = await account.getDetail(listJawaban[index].id_user)
         listSubmission.push({
            user: user,
            jawaban: item
         });
      });
   } catch (error) {
      return next(error);
   }

   console.log(listSubmission);
   res.render('teacher-test-result', { infoUjian: infoUjian, listSubmission: listSubmission });
});

Teacher.get('/:idSoal/get-result', async function(req, res, next){
   var idSoal = req.params.idSoal;
   var listJawabanBenar = [];
   var listJawabanSiswa = [];

   //https://skorin.herokuapp.com/koreksi/
   try{
      var soal = await Soal.find({ parent: idSoal });
      var listSubmission = await Jawaban.find({ id_soal: idSoal });

      await soal.map((item) => {
         listJawabanBenar.push(item.a);
      });

      await listSubmission.map((item) => {
         listJawabanSiswa.push({
            nama: item.id_user,
            jawaban: item.jawaban
         });
      });
   }catch(error){
      return next(error);
   }
   
   var requestBody = {
      jawaban_benar: listJawabanBenar,
      jawaban_siswa: listJawabanSiswa
   };

   console.log(requestBody);
   try {
      var result = await axios.post('https://skorin.herokuapp.com/koreksi/', requestBody);
      var hasil = result.data;

      console.log(result);

      await hasil.map(async function(item){
         console.log(item);
         var update = { 
            benar: item.skor_jawaban[0].total_jawaban_benar,
            salah: item.skor_jawaban[0].total_jawaban_salah,
            skor: item.skor_jawaban[0].final_score,
            isKoreksi: true
         }

         await Jawaban.updateOne({ id_user: item.siswa, id_soal: idSoal }, { $set: update })
      });
   } catch (error) {
      return next(error);
   }

   res.redirect(req.baseUrl + '/' + idSoal + '/test-result');
   //res.send(result.data);
});

module.exports = Teacher;