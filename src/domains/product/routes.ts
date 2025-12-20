import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { Product } from './entity.js';

const createProductSchema = Product.pick({
  name: true,
  description: true,
  price: true,
});

export async function productRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    '/',
    {
      schema: {
        body: createProductSchema,
      },
    },
    async (request) => {
      const { name, description, price } = request.body;
      const [product] = await fastify
        .knex<Product>('products')
        .insert({
          name,
          description,
          price,
        })
        .returning('*');
      return product;
    },
  );

  app.get(
    '/',
    {
      schema: {
        response: {
          200: z.array(Product),
        },
      },
    },
    async () => {
      const products = await fastify.knex<Product>('products').select('*');
      return products;
    },
  );
}
