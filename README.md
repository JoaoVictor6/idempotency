# Idempotency and Infrastructure Study

This repository is a hands-on project for studying and demonstrating idempotency in APIs, particularly in the context of preventing race conditions in payment systems. It also serves as a practical example of defining and deploying a serverless application using Infrastructure as Code (IaC).

The core of the project is a Fastify API with a payment endpoint (`/payment/purchase`) that simulates a long-running process. This endpoint is vulnerable to race conditions, where multiple identical requests could result in duplicate payments. The solution implemented here uses a server-side idempotency key strategy with Redis to ensure that a payment operation is processed only once, even when multiple requests are received simultaneously.

## Tech Stack

- **Application**:
  - [Fastify](https://fastify.io/): A fast and low overhead web framework for Node.js.
  - [TypeScript](https://www.typescriptlang.org/): For static typing and better developer experience.
  - [Knex.js](https://knexjs.org/): A SQL query builder for PostgreSQL, MySQL, etc.
  - [Zod](https://zod.dev/): For schema declaration and validation.
- **Database & Caching**:
  - [PostgreSQL](https://www.postgresql.org/): As the primary relational database.
  - [Redis](https://redis.io/): Used to store idempotency keys for a short TTL.
- **Infrastructure & Deployment**:
  - [AWS Lambda](https://aws.amazon.com/lambda/): The target compute service for the serverless function.
  - [Terraform](https://www.terraform.io/): To define and manage the cloud infrastructure as code.
  - [Serverless Framework](https://www.serverless.com/): To facilitate the deployment of the Lambda function.

## Idempotency Implementation

While a simple unique composite key `(userId, productId)` in the database can prevent duplicate entries, it has limitations, such as returning a `500 Internal Server Error` on the second request instead of a clear success message. This is not a truly idempotent or user-friendly solution.

This project implements a more robust **Idempotency Key** pattern:

1.  **Key Generation**: When a `/purchase` request is received, a unique idempotency key is generated on the server using the combination of `productId` and `userId`.
2.  **Redis Check**: The server checks if this key exists in Redis.
    -   **If the key exists**: It means a request with the same payload is already being processed or has just completed. The server immediately returns a `204 No Content` status, signaling to the client that the request is acknowledged but no new action will be taken.
    -   **If the key is new**: The server saves the key in Redis with a Time-to-Live (TTL) of 5 minutes and proceeds with the payment processing logic.
3.  **Database Transaction**: The new payment is inserted into the database.
4.  **Response**: The client receives a `200 OK` with the details of the newly created payment.

This approach ensures that the business logic is executed only once, provides a better client experience, and makes the endpoint truly idempotent.

## Getting Started

### Prerequisites

- Node.js
- Docker
- AWS CLI (for deployment)
- Terraform (for deployment)

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JoaoVictor6/idempotency.git
    cd idempotency
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start local database and Redis:**
    This project includes a `docker-compose.yml` file for convenience.
    ```bash
    docker-compose up -d
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the root of the project.
    ```env
    DB_CLIENT=pg
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=yourpassword
    DB_DATABASE=idempotency_db
    REDIS_HOST=localhost
    REDIS_PORT=6379
    ```

5.  **Run database migrations and seeds:**
    ```bash
    npm run db:migrate
    npm run db:seed
    ```

### Running the Application Locally

**Important Note:** The `serverless-offline` command, commonly used for local Lambda emulation, has a known compatibility issue with `knex`'s dynamic database drivers and the `esbuild` bundler used by the Serverless Framework. This can cause "Could not resolve" errors.

Therefore, the recommended way to run the application locally is to bypass `serverless-offline` and run it as a standard Node.js application.

```bash
# Set the LOCAL environment variable and run the index file with ts-node
LOCAL=true npx ts-node src/index.ts
```
The server will be available at `http://localhost:3000`.

## Available Scripts

- `LOCAL=true npx ts-node src/index.ts`: Runs the application locally as a standard Node.js server.
- `npm run db:migrate`: Applies the latest database migrations.
- `npm run db:make-migration`: Creates a new migration file.
- `npm run db:seed`: Runs the database seeds.
- `npm run db:ui`: Opens a terminal-based UI for the database.
- `npm run simulate:race-condition`: Runs a script to simulate concurrent requests to the payment endpoint.

## API Endpoints

- `POST /user`: Creates a new user.
- `GET /user`: Returns a list of users.
- `POST /product`: Creates a new product.
- `GET /product`: Returns a list of products.
- `POST /payment/purchase`: Processes a payment. This endpoint is protected by the idempotency logic.

## Infrastructure

The cloud infrastructure is managed with Terraform and is defined in the `infra` directory. For more details, see the `infra/README.md` file.
