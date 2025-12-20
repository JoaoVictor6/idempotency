import awsLambdaFastify from '@fastify/aws-lambda';
import Fastify from 'fastify';

const app = Fastify({
  logger: true
});

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

if (process.env.LOCAL) {
  start();
}

export const handler = awsLambdaFastify(app);