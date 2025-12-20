import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { Payment } from './entity.js';

const purchaseBodySchema = z.object({
  userId: z.number(),
  productId: z.number(),
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function paymentRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    '/purchase',
    {
      schema: {
        body: purchaseBodySchema,
      },
    },
    async (request) => {
      const { userId, productId } = request.body;

      const existingPayment = await fastify
        .knex<Payment>('payments')
        .where({
          userId,
          productId,
        })
        .first();

      if (existingPayment) {
        return {
          message: 'Payment already processed',
          payment: existingPayment,
        };
      }

      // Artificial delay to simulate a long-running process
      await sleep(2000);

      const [newPayment] = await fastify
        .knex<Payment>('payments')
        .insert({
          userId,
          productId,
          status: 'completed',
        })
        .returning('*');

      return {
        message: 'Payment successful',
        payment: newPayment,
      };
    },
  );
}
