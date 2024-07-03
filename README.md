# Online Marketplace API

This project is a comprehensive RESTful API for an online marketplace, allowing users to buy and sell products, manage inventory, and process orders. It includes authentication, authorization, database integration, and various features required for a scalable and secure application.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [Database Schema](#database-schema)
5. [Authentication and Authorization](#authentication-and-authorization)
6. [API Documentation](#api-documentation)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [System Design](#system-design)
10. [Additional Features](#additional-features)
11. [Future Improvements](#future-improvements)
12. [Contributing](#contributing)
13. [License](#license)

## Features

- **Users:**

  - Register, login, manage profile.
  - Email verification on registration.

- **Products:**

  - Create, update, delete products for sale.
  - Admins can mark products as featured.

- **Orders:**

  - Place orders, track order status.
  - Email notifications for order status updates.
  - Queue system for asynchronous order processing.

- **Categories:**

  - Categorize products for browsing.

- **Reviews:**
  - Allow users to review and rate products they have ordered.

## Technologies Used

- **Backend Framework:** NestJS (Node.js with TypeScript)
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose
- **Authentication:** JWT (JSON Web Tokens)
- **Documentation:** Swagger OpenAPI 3
- **Testing:** Jest (for unit and integration tests)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Docker installed on your machine.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/iradukundapaci/online-marketplace-api.git
   ```
2. Navigate to project directory
   ```sh
   cd online-marketplace-api
   ```
3. Build and run the docker containers
   ```sh
   docker-compose up
   ```

## Database Schema

The database schema is designed to efficiently store and manage marketplace data. Here's a simplified representation:

https://drive.google.com/file/d/16JgJChel3B1Om6WbKPbFusugyS8Rdy8y/view?usp=sharing

## Authentication and Authorization

JWT (JSON Web Tokens) are used for authentication. User roles (buyer, seller, admin) determine access permissions to different endpoints.

## API Documentation

Swagger OpenAPI 3 documentation is available to browse and understand API endpoints. Access it at http://localhost:port/api-docs.

## Testing

Unit and integration tests are implemented using Jest. To run tests:

1. Create .env.test file:

```sh
    cp .env.example .env.test
```

2. install packages:

```sh
  npm install
```

3. run test:

```sh
  npm run test
```

## Deployment

For deployment, ensure Docker is installed on your server. Use Docker Compose to manage the application stack with multiple services.

Docker commands

1. Build Docker images:

```sh
  docker-compose up --build
```

2. Stop containers

```sh
  docker-compose down
```

## System Design

The application follows a microservices architecture with separate services for API server, database (PostgreSQL), and potentially other services like email notifications (using SMTP). See System Design Diagram for details.

## Additional Features

1. Image upload funtionality for products
2. Payment processing funtionality with flutterwave
