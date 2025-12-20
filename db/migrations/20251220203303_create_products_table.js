export async function up(knex) {
    return knex.schema.createTable('products', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.integer('price').notNullable().comment("cents");
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}
export async function down(knex) {
    return knex.schema.dropTable('products');
}
