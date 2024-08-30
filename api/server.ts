import Fastify from 'fastify';
import fs from 'fs';
import path from 'path';

const fastify = Fastify({ logger: true });

const dataFilePath = path.join(__dirname, 'webhook-data.json');

fastify.post('/', async (request, reply) => {
  try {
    const data = request.body;
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    reply.send({ status: 'success', message: 'Data saved' });
  } catch (error) {
    reply.status(500).send({ status: 'error', message: 'Failed to save data' });
  }
});

fastify.get('/webhook-data', async (request, reply) => {
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

const startServer = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running at http://localhost:3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
