require('dotenv').config();

const Hapi = require('@hapi/hapi');

const album = require('./api/albums');
const AlbumValidator = require('./validator/albums');
const AlbumService = require('./services/postgres/AlbumsServices');

const song = require('./api/songs');
const SongValidator = require('./validator/songs');
const SongsService = require('./services/postgres/SongsServices');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator
      }
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator
      }
    }
  ]);

  server.ext('onPreResponse', (request, h) => {
    // get context response from request
    const { response } = request;

    // error client handling from internal
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

     return h.continue;
  });

  await server.start();
  console.log(`App is running on ${server.info.uri}`);
}

init();