const mongoose = require('mongoose');

module.exports = mongoose.model('manifest_soal', {
   title: String,
   description: { type: String, required: false },
   id: String,
   id_user: String
});