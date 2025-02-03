# Expense Splitter Backend API

This API provides endpoints for managing groups, members, expenses, and balances for an expense splitting application. Each endpoint is described below along with its purpose and usage examples.

# Techs

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/VisualStudioCode-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Amazon Aws](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

In this project, we used the following technologies:

- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)- Text editor with following plugins installed: [DotENV](https://github.com/mikestead/vscode-dotenv), [ESLint](https://github.com/Microsoft/vscode-eslint), [GitLens](https://github.com/eamodio/vscode-gitlens) e [vscode-icons](https://github.com/vscode-icons/vscode-icons).
- [Jest](https://jestjs.io/) - Javascript Test Framework.
- [ESLint](https://github.com/eslint/eslint) - ESLint to padronize the project code.
- [Prettier](https://prettier.io/) - To format code automatically.
- [Prisma](https://www.prisma.io/) - Prisma is a next-generation ORM and database toolkit that provides a type-safe database client, automated migrations, and advanced query capabilities for Node.js and TypeScript applications.

## Getting Started

### Prerequisites

To set up and run this project, ensure you have the following installed:

- **Node.js**: `>= 18.20.4`
- **npm**: Comes with Node.js
- **Docker & Docker Compose** (optional): To run the application in a containerized environment

---

### Setup Instructions

## Step 1: Clone the Repository

### Repository is private, you can request access if necessary

```bash
git clone https://github.com/RKRafaelNascimento/expense-splitter-backend.git
```

## Step 2: Configure Environment Variables

1 - Copy the .env.example file to create a new .env.development file

```bash
cp .env.example .env.development
```

2 - Fill in the necessary values in the .env.development file. Example

#### Fill in the necessary values in the .env.development file. Example

```bash
PORT=3000
NODE_ENV=development
```

## Step 3: Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

## Step 4: Run Docker Compose

Run the following command to start the Postgres and pgAdmin containers. This command will launch the Postgres database and the pgAdmin web interface, which are required to apply the latest database schema changes.

```bash
docker-compose up postgres pgadmin
```

## Step 4.1: Run Database Migrations

Run the migration script to apply the latest database schema changes:

```bash
npm run migrate
```

## Step 5: Seed the Database

Run the seed script to populate the database with initial data:

```bash
npm run seed:dev
```

## Step 5: Run the Application

### Option 1: Run Locally

To run the application locally, use the development start command:

```bash
npm run start:dev
```

### Option 2: Run with Docker Compose

If you choose to run the application using Docker, follow these steps to set up the database:

```bash
docker-compose up
```

Apply the latest database migrations:

```bash
npm run migrate:docker
```

Populate the database with initial data:

```bash
npm run seed:docker
```

Application will run on the port specified in your .env.development file (default: 3000).

---

### Additional Commands

Here are some additional commands you can use:

Build: Build the application for production

```bash
npm run build
```

Lint: Run the linter to check for code issues

```bash
npm run lint
```

Lint (Fix): Automatically fix linting issues

```bash
npm run lint:fix
```

Run Tests: Run all tests

```bash
npm run test
```

---

### Postman Collection

The Postman collection is available in the following path:

```
\_postman
```

---

### Swagger API Documentation

The API documentation is available at the following endpoint after starting the application:

```bash
http://localhost:<PORT>/api-docs
```

Replace <PORT> with the value defined in your .env.development file (default: 3000).

---

# Design Decisions and Technical Considerations

## About the Structure

Each module (balance, expense, group, payment) has its own folder for organization, ensuring that each part of the code has a single point of maintenance. This facilitates scalability, improves readability, and, in the future, if it becomes necessary to break it into microservices, it will be easier to extract the module and migrate it to a separate API.

Within each module, there is a clear separation between controllers, services, and repositories, following the Layered Architecture pattern, where business logic is isolated from control logic and data persistence.

## About the Requirement: File Upload

I chose to use a queue to meet the following requirement:

```
Technological Requirements: It is important to demonstrate how your system handles high load.
```

The file processing was implemented asynchronously to ensure performance, scalability, and resilience, isolating failures and improving the user experience without blocking the system. Additionally, I provided a diagram in Excalidraw, located in the Consumer section, with a Flow Diagram, where I explain possible improvements.

## About the Requirement: Email Notification

I did not implement email sending because it would require setting up a domain for SES (Simple Email Service) dispatch. However, I have implemented the class in src/shared/NotificationService in case you want to review it.

## About AWS Resources

I created S3 and SQS services, along with a user for the application with restricted access to these services, ensuring the correct operation of the upload functionality. Additionally, I created a second user with the same access permissions, in case you need to view files in S3 or track messages in SQS.

https://aws-rafaeldev-1.signin.aws.amazon.com/console
username: Edmundo
password: Edmundo@2025

After completing the test, I will delete the users, as I am committing the credentials. If you have any questions, I am available.

## Additional Endpoints

I created two extra endpoints: Create Member and Add Member, in case you want to generate your own test data. However, I have also provided seeders to facilitate test data creation.

**Note:** With more time, I would also implement integration tests, but for now, I have only included unit tests in the Expense, Payment, and Balance services.

# API Endpoints Documentation

## Consumer (Expense Batch Processor)

If you want to run the consumer process to handle the CSV file uploaded via **POST /expense/upload**, use the following command:

```bash
npm run start:consumer
```

This consumer process will process the uploaded CSV file.

**Note:** There is an example CSV available in the ./folder/expenseBatch.csv directory.

**Note:** The required bucket and queue have already been set up. For a visual representation of the processing flow, please refer to the [Flow Diagram](https://excalidraw.com/#room=832d03ed9ebe6ca64e9e,CiXCqQA3e3AiOaWZN8R_WA).

## Payment

**Endpoint:** POST /payment  
**Description:** Marks an expense as paid by transferring money from the payer to the expense creator, updating the expense split and the expense status, and sending a notification.  
**Objective:** Process a payment for an expense.

---

## Balance

**Endpoint:** GET /balance/{groupId}  
**Description:** Returns the balances for all members in a group, including current balance, total amounts owed, and net balance.  
**Objective:** Retrieve all balance details for a given group.

---

## Expense

**Endpoint:** POST /expense  
**Description:** Creates a new expense with splits among group members. The authenticated member is the creator, and an optional array of member IDs can be provided to split the expense (the creator must not be included).  
**Objective:** Record a new expense and distribute its cost among group members.

**Endpoint:** POST /expense/upload  
**Description:** Uploads a CSV file to create expenses in batch. The endpoint accepts a CSV file and returns the URL of the uploaded file on S3.  
**Objective:** Bulk create expenses from a CSV file.

---

## Group

**Endpoint:** POST /group  
**Description:** Creates a new group with the provided name. If a group with the same name already exists, an error is thrown.  
**Objective:** Create a new group for expense splitting.

**Endpoint:** POST /group/add-member  
**Description:** Adds a member to an existing group. Throws errors if the member or group does not exist, or if the member is already in the group. When a member is successfully added, a balance record for that member in the group is created with a value of zero.  
**Objective:** Add a new member to an existing group and initialize their group balance to zero.

---

## Member

**Endpoint:** POST /member  
**Description:** Creates a new member using the provided name and email. If a member with the given email already exists, an error is thrown.  
**Objective:** Register a new member in the system.
