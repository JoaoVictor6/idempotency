export async function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}
export async function down(knex) {
    return knex.schema.dropTable('users');
}
