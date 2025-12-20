import awsLambdaFastify from '@fastify/aws-lambda';
import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { userRoutes } from './domains/user/routes.js';
import { paymentRoutes } from './domains/payment/routes.js';
import { productRoutes } from './domains/product/routes.js';
import knex from './db/db.js';

const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.decorate('knex', knex);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(userRoutes, { prefix: '/user' });
app.register(paymentRoutes, { prefix: '/payment' });
app.register(productRoutes, { prefix: '/product' });

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
