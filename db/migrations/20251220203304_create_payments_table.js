export async function up(knex) {
    return knex.schema.createTable('payments', (table) => {
        table.increments('id').primary();
        table.string('status').notNullable().defaultTo('pending');
        table.integer('userId').unsigned().notNullable();
        table.foreign('userId').references('id').inTable('users');
        table.integer('productId').unsigned().notNullable();
        table.foreign('productId').references('id').inTable('products');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.index('userId');
        table.index('productId');
    });
}
export async function down(knex) {
    return knex.schema.dropTable('payments');
}
