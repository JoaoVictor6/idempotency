import { FastifyInstance } from 'fastify';
import { User } from './entity.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function userRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    '/',
    {
      schema: {
        response: {
          200: z.array(User),
        },
      },
    },
    async () => {
      const users = await fastify.knex<User>('users').select('*');
      return users;
    },
  );

  const createUserSchema = User.pick({ username: true });
  app.post(
    '/',
    {
      schema: {
        body: createUserSchema,
      },
    },
    async (request) => {
      const { username } = request.body;
      const [user] = await fastify
        .knex<User>('users')
        .insert({ username })
        .returning('*');
      return user;
    },
  );
}
