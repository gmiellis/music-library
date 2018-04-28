const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { getAlbums } = require('../../controllers/Album');
const Artist = require('../../models/Artist');
const Album = require('../../models/Album');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('GET Albums endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, done);
  });

  it('Should get an artist\'s albums', (done) => {
    const artist = new Artist({ name: 'Coldplay', genre: 'sad' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'error saving artist');
      }

      const albums = [
        { name: 'Mylo Xyloto', year: 2011, artist },
        { name: 'Ghost Stories', year: 2014, artist },
      ];

      Album.insertMany(albums, (albumErr, albumsCreated) => {
        if (albumErr) {
          console.log(err, 'error inserting albums');
        }

        const request = httpMocks.createRequest({
          method: 'GET',
          url: `/Artist/${artistCreated._id}/albums`, // eslint-disable-line
          params: {
            artistId: artistCreated._id.toString(), // eslint-disable-line
          },
        });

        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter,
        });

        getAlbums(request, response);

        response.on('end', () => {
          const albumsFound = response._getData(); //eslint-disable-line
          expect(albumsFound).toEqual(JSON.stringify(albumsCreated));
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
      Album.collection.drop((e) => {
        if (e) {
          console.log(e);
        }
        done();
      });
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
