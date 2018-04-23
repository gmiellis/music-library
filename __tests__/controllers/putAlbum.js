const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { putAlbum } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('PUT Album endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });

  it('Should add an album to an Artist', (done) => {
    const artist = new Artist({ name: 'Coldplay', genre: 'sad' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'stuff went wrong');
      }

      const request = httpMocks.createRequest({
        method: 'PUT',
        URL: `/artist/${artistCreated._id}/album`, // eslint-disable-line
        params: {
          artistId: artistCreated._id, // eslint-disable-line
        },
        body: {
          name: 'Ghost Stories',
          year: 2014,
        },
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      putAlbum(request, response);

      response.on('end', () => {
        Artist.findById(artistCreated._id, (err, foundArtist) => { //eslint-disable-line
          console.log(foundArtist)
          expect(foundArtist.albums.length).toEqual(1);

          done();
        });
      });
    });
  });

  afterEach((done) => {
    Artist.collection.drop((e) => {
      if (e) {
        console.log(e);
      }
      done();
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
