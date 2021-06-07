import server from '../../src/server.js';

export default async () => {
   global.httpServer = await server.start({port: 4000});

}