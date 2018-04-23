const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const ArtistController = require('./controllers/Artist');

require('dotenv').config({
  path: path.join(__dirname, './settings.env'),
});

const app = express();
mongoose.connect(process.env.DATABASE_CONN);

app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello World!'));
app.post('/Artist', ArtistController.post);
app.get('/Artist', ArtistController.list);
app.get('/Artist/:artistId', ArtistController.get);
app.put('/Artist/:artistId', ArtistController.put);
app.delete('/Artist/:artistId', ArtistController.deleteArtist);

app.listen(3000, () => console.log('Music Library API is running'));
