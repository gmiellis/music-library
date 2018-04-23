const mongoose = require('mongoose');

const { Schema } = mongoose;
const artistSchema = new Schema({
  name: String,
  genre: String,
  albums: [{
    name: String,
    year: Number,
  }],
});

module.exports = mongoose.model('Artist', artistSchema);
