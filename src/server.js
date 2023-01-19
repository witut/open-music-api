require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumsService = require('./services/AlbumsService');
const AlbumValidator = require('./validator/albums');
const songs = require('./api/songs');
const SongsService = require('./services/SongsService');
const SongValidator = require('./validator/songs');
const ClientError = require('./exceptions/ClientError');

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

  // Meminimalisir boilerplate code pada handler dengan memanfaatkan onPreResponse event extensions
  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks respons dari request
    const { response } = request;

    if (response instanceof Error) {
      // Penanganan client error secara internal
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // Mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // Penanganan error server sesuai dengan kebutuhan.
      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });

      newResponse.code(500);
      return newResponse;
    }
    // Jika tidak error, lanjutkan dengan response sebelumnya.
    return h.continue;
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
