const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postSong } = require('../../controllers/Song');
const Artist = require('../../models/Artist');
const Album = require('../../models/Album');
const Song = require('../../models/Song');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('PUT album endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });

  it('should add a song to an album', (done) => {
    const artist = new Artist({ name: 'Coldplay', genre: 'sad' });
    artist.save((artistCreateError, artistCreated) => {
      if (artistCreateError) {
        console.log(artistCreateError);
      }

      const album = new Album({ name: 'Ghost Stories', year: '2014', artist: artistCreated });
      album.save((albumCreateError, albumCreated) => {
        if (albumCreateError) {
          console.log(albumCreateError);
        }
        const request = httpMocks.createRequest({
          method: 'POST',
            URL: `/album/${albumCreated._id}/song`, // eslint-disable-line
          params: {
              albumId: albumCreated._id // eslint-disable-line
          },
          body: {
            name: 'A Sky Full of Stars',
            artistId: artistCreated._id // eslint-disable-line
          },
        });

        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter,
        });

        postSong(request, response);

        response.on('end', () => {
          const songCreated = JSON.parse(response._getData()); //eslint-disable-line
          expect(songCreated.name).toEqual('A Sky Full of Stars');
          expect(songCreated.artist._id).toEqual(artistCreated._id.toString()); //eslint-disable-line
          expect(songCreated.album._id).toEqual(albumCreated._id.toString()); //eslint-disable-line
          done();
        });
      });
    });
  });

  afterEach((done) => {
    Artist.collection.drop((artistDropErr) => {
      Album.collection.drop((albumDropErr) => {
        Song.collection.drop((songDropErr) => {
          if (artistDropErr || albumDropErr || songDropErr) {
            console.log('Can not drop test collections');
          }
          done();
        });
      });
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
