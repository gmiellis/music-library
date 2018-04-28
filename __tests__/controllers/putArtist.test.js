const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { put } = require('../../controllers/Artist');
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
        method: 'PUT',
        URL: '/Artist/1234',
        params: {
          artistId: artistCreated._id, // eslint-disable-line
        },
        body: {
          name: 'Coldplay',
          genre: 'Rock',
        },
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      put(request, response);

      response.on('end', () => {
        const updatedArtist = JSON.parse(response._getData()); //eslint-disable-line
        expect(updatedArtist).toEqual({
          __v: 0,
          _id: artistCreated._id.toString(), // eslint-disable-line
          name: 'Coldplay',
          genre: 'Rock',
        });
        done();
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
