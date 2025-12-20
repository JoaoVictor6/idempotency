import fetch from 'node-fetch';
import ora from 'ora';
import chalk from 'chalk';
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000/dev';

async function setupData() {
  const setupSpinner = ora('Setting up data...').start();
  try {
    // Create a new user
    const userResponse = await fetch(`${BASE_URL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: faker.internet.username() }),
    });
    const user = await userResponse.json();

    // Create a new product
    const productResponse = await fetch(`${BASE_URL}/product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Product',
        description: 'A product for testing',
        price: 1000,
      }),
    });
    const product = await productResponse.json();

    setupSpinner.succeed('Data setup complete!');
    return { userId: user.id, productId: product.id };
  } catch (error) {
    setupSpinner.fail('Data setup failed.');
    console.error(chalk.red(error));
    process.exit(1);
  }
}

async function run() {
  console.log(chalk.blue('Simulating race condition for duplicate purchase...'));
  console.log(chalk.blue('--------------------------------------------------'));

  const { userId, productId } = await setupData();

  const body = { userId, productId };

  const spinner = ora('Sending two concurrent requests...').start();

  const promises = [
    fetch(`${BASE_URL}/payment/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => res.json()),
    fetch(`${BASE_URL}/payment/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => res.json()),
  ];

  try {
    const results = await Promise.all(promises);
    spinner.succeed('Concurrent requests finished!');

    console.log(chalk.green('\n--- Results ---'));
    results.forEach((result, index) => {
      console.log(chalk.yellow(`Request ${index + 1}:`));
      console.log(result);
    });
    console.log(chalk.green('--- End Results ---\n'));

    if (results[0].payment && results[1].payment && results[0].payment.id === results[1].payment.id) {
      console.log(chalk.green('Race condition avoided! Both requests point to the same payment.'));
      return;
    }

    if (results[0].message === 'Payment successful' && results[1].message === 'Payment successful') {
      console.log(chalk.red('Race condition detected! Two different payments were created.'));
      return;
    }

    // If we reach here, it means the race condition was avoided for other reasons
    // (e.g., one request failed, or one was a successful idempotent response)
    console.log(chalk.green('Race condition avoided!'));
  } catch (error) {
    spinner.fail('An error occurred during the simulation.');
    console.error(chalk.red(error));
  }
}

run();
