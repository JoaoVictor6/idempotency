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

  const requestFn = () =>
    fetch(`${BASE_URL}/payment/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  const promises = [requestFn(), requestFn()];

  try {
    const responses = await Promise.all(promises);
    spinner.succeed('Concurrent requests finished!');

    const results = await Promise.all(
      responses.map(async (res) => {
        return {
          status: res.status,
          body: res.status === 204 ? null : await res.json().catch(() => null),
        };
      }),
    );

    console.log(chalk.green('\n--- Results ---'));
    results.forEach((result, index) => {
      console.log(
        chalk.yellow(`Request ${index + 1} (Status: ${result.status}):`),
      );
      console.log(result.body);
    });
    console.log(chalk.green('--- End Results ---\n'));

    const [res1, res2] = results;

    const successfulCreationStatuses = [200, 201];
    const idempotencySuccessStatus = 204;

    const res1Created = successfulCreationStatuses.includes(res1.status);
    const res2Created = successfulCreationStatuses.includes(res2.status);

    const res1Idempotent = res1.status === idempotencySuccessStatus;
    const res2Idempotent = res2.status === idempotencySuccessStatus;

    if (
      res1Created &&
      res2Created &&
      res1.body?.payment?.id !== res2.body?.payment?.id
    ) {
      console.log(
        chalk.red('Race condition detected! Two different payments were created.'),
      );
    } else if (
      res1Created &&
      res2Created &&
      res1.body?.payment?.id === res2.body?.payment?.id
    ) {
      console.log(
        chalk.green('Race condition avoided! Both requests resolved to the same payment.'),
      );
    } else if ((res1Created && res2Idempotent) || (res1Idempotent && res2Created)) {
      console.log(
        chalk.green('Race condition avoided! One request created the payment, the other was handled idempotently.'),
      );
    } else if (res1Idempotent && res2Idempotent) {
      console.log(
        chalk.green('Race condition avoided! Both requests were handled idempotently (payment may have existed already).'),
      );
    } else {
      console.log(chalk.yellow('Simulation finished with an unexpected outcome.'));
      console.log('Response statuses:', results.map((r) => r.status));
    }
  } catch (error) {
    spinner.fail('An error occurred during the simulation.');
    console.error(chalk.red(error));
  }
}

run();
