const mongoose = require('mongoose');

const { Schema } = mongoose;
const songSchema = new Schema({
  name: String,
  artist: { type: Schema.Types.ObjectId, ref: 'Artist' },
  album: { type: Schema.Types.ObjectId, ref: 'Album' },
});

module.exports = mongoose.model('Song', songSchema);
