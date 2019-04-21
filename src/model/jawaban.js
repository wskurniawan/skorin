const mongoose = require('mongoose');

module.exports = mongoose.model('jawaban', {
   id_user: String,
   id_soal: String,
   nama_ujian: String,
   jawaban: [String],
   benar: Number,
   salah: Number,
   skor: Number,
   isKoreksi: Boolean
});