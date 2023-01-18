require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumsService = require('./services/AlbumsService');
const AlbumValidator = require('./validator/albums');
const songs = require('./api/songs');
const SongsService = require('./services/SongsService');
const SongValidator = require('./validator/songs');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsSerice = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsSerice,
        validator: SongValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server up and running at ${server.info.uri}`);
};

init();
