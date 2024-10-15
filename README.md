# Ticket System
A simple ticket system built with Node.js, Express, and MongoDB.
## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/jamesanih/ticket-system.git
   cd ticket-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env`
   - Fill in the necessary environment variables in the `.env` file

## Running Instructions

1. To start the development server:
   ```
   npm run dev
   ```

2. To run tests:
   ```
   npm test
   ```

3. To build for production:
   ```
   npm run build
   ```

4. To start the production server:
   ```
   npm start
   ```

## Folder Structure

The project follows a modular structure for better organization and maintainability:

```
project-root/
│
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models and database schemas
│   ├── routes/         # API route definitions
│   ├── middleware/     # Custom middleware functions
│   ├── utils/          # Utility functions and helpers
│   ├── config/         # Configuration files
│   ├── tests/          # Test files
│   └── app.js          # Main application file
│
├── .env                # Environment variables (ignored by git)
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies and scripts
├── README.md           # Project documentation
└── jest.config.js      # Jest configuration
```

## API Documentation

This project uses Swagger for API documentation. To access the Swagger UI:

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/api-docs
   ```

   Replace `3000` with the actual port number if it's different in your setup.

3. You can now explore the API endpoints, test them directly from the Swagger UI, and view request/response schemas.

## Database Migrations

This project uses database migrations to manage changes to the database schema. Here's how to work with migrations:

### Running Migrations

To apply migrations to your database, run:

```
npx sequelize-cli db:migrate
```

### Rolling Back Migrations

To roll back the last migration, run:

```
npx sequelize-cli db:migrate:undo

```



