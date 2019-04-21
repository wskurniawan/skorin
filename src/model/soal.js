const mongoose = require('mongoose');

module.exports = mongoose.model('soal', {
   q: String,
   a: String,
   id: String,
   parent: String
});