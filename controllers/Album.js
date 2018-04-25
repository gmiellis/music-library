const Artist = require('../models/Artist');
const Album = require('../models/Album');

exports.postAlbum = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Artist does not exist');
    }

    const myAlbum = new Album({
      artist,
      name: req.body.name,
      year: req.body.year,
    });

    myAlbum.save((createErr, createdAlbum) => {
      if (createErr) {
        res.json('Could not create an album');
      }

      res.json(createdAlbum);
    });
  });
};
