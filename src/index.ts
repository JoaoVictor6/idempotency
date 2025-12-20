const awsLambdaFastify = require('@fastify/aws-lambda');
const Fastify = require('fastify');
import { FastifyRequest, FastifyReply } from 'fastify';

const app = Fastify({
  logger: true
});

app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
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

module.exports.handler = awsLambdaFastify(app);