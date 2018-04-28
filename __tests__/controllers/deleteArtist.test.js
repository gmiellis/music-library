const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { deleteArtist } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('PUT Artist endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });

  it('Should update an artist record when PUT endpoint is called', (done) => {
    const artist = new Artist({ name: 'Coldplay', genre: 'sad' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'stuff went wrong');
      }

      const request = httpMocks.createRequest({
        method: 'DELETE',
        URL: '/Artist/1234',
        params: {
          artistId: artistCreated._id, // eslint-disable-line
        },
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      deleteArtist(request, response);

      response.on('end', () => {
        Artist.findById(artistCreated._id, (err, noSuchArtist) => {
          expect(noSuchArtist).toBe(null);
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
