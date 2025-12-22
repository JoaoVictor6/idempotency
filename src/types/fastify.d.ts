import { Knex } from 'knex';
import { idempotency } from '../domains/idempotency/index.ts';

declare module 'fastify' {
  export interface FastifyInstance {
    knex: Knex;
    idempotency: ReturnType<typeof idempotency>
  }
}
