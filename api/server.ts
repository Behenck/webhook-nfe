import { fastify } from 'fastify';
import fs from 'fs';
import path from 'path';

const app = fastify();

const dataFilePath = path.join(__dirname, 'webhook-data.json');

app.get('/', async (request, reply) => {
  return { message: 'Hello, world!' };
});

app.post('/', async (request, reply) => {
  const data = request.body;

  console.log(data)
  reply.send({ status: 'success', message: 'Data saved' });
  // try {
  //   const data = request.body;
  //   fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  //   reply.send({ status: 'success', message: 'Data saved' });
  // } catch (error) {
  //   reply.status(500).send({ status: 'error', message: 'Failed to save data' });
  // }
});

app.get('/webhook-data', async (request, reply) => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      reply.send(JSON.parse(data));
    } else {
      reply.status(404).send({ status: 'error', message: 'No data found' });
    }
  } catch (error) {
    reply.status(500).send({ status: 'error', message: 'Failed to read data' });
  }
});

app.listen({ port: 3000, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
});
