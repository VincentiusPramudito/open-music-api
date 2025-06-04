require('dotenv').config();

const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST
  });

  await server.start();
  console.log(`App is running on ${server.info.uri}`);
}

init();