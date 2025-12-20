import { Knex } from "knex";
import { faker } from '@faker-js/faker';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("products").del();

  // Inserts seed entries
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.int({ max: 100_000_000, min: 100 })
    });
  }

  await knex("products").insert(products);
};
