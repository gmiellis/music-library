const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { get } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('GET Artist endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });

  it('Should retrieve an artist from the database', (done) => {
    const artist = new Artist({ name: 'Coldplay', genre: 'sad' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'stuff went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'GET',
        URL: '/Artist/123',
        params: {
          artistId: artistCreated._id, // eslint-disable-line
        },
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      get(request, response);

      response.on('end', () => {
        const artistsFound = JSON.parse(response._getData()); //eslint-disable-line
        expect(artistsFound.name).toBe('Coldplay');
        expect(artistsFound.genre).toBe('sad');
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
