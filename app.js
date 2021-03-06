require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// This makes the public folder available in the html files
app.use(express.static(__dirname + '/public'));

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://www.example.com/callback'
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    // Our routes go here:
   
    app.get('/', (req, res) => {
      res.render('artist');
    });

    app.get('/artist-search-results', (req, res) => {
      const artist = req.query.artist.toLowerCase();

      spotifyApi
        .searchArtists(artist)
        .then(data => {
          res.render('artist-search-results', { artist: data.body.artists.items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    });

    app.get('/albums/:artistId', (req, res, next) => {
      // .getArtistAlbums() code goes here
      const id = req.params.artistId;

      spotifyApi
        .getArtistAlbums(id)
        .then(data => {
          res.render('albums', { id: data.body.items });
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
    });


    // Get tracks in an album

    app.get('/tracks/:id', (req, res, next) => {

      spotifyApi.getAlbumTracks(req.params.id)
      .then(function(data) {
        console.log(data.body.items);
        res.render('tracks', { id: data.body.items });
      }, function(err) {
        console.log('Something went wrong!', err);
      });

    });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
