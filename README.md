# Express Boilerplate 📚

> An educational and practical boilerplate to learn the fundamentals of backend development with Node.js, Express and TypeScript

## Overview

This project is a comprehensive Express.js boilerplate designed to demonstrate modern backend development practices. It evolved from a simple MVC pattern to a modular, scalable architecture implementing Clean Architecture principles with proper separation of concerns.

## 🚀 Live Demo

API Documentation: https://express-boilerplate-oh96.onrender.com/api-docs/
Try out the API endpoints directly from the interactive Swagger documentation!

## Features

### 🏗️ Architecture
- **Clean Architecture**: Modular structure with separated domains, use cases, and infrastructure
- **MVC Pattern**: Controllers properly abstracted with domain logic
- **Dependency Injection**: Factory pattern for use case instantiation
- **TypeScript**: Full type safety throughout the application

### 🛡️ Security & Middleware
- **JWT Authentication**: Token-based authentication with 7-day expiration
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configurable cross-origin resource sharing
- **Error Handling**: Centralized error handling middleware
- **Request Logging**: Comprehensive request logging system

### 📊 Database & ORM
- **Prisma ORM**: Type-safe database operations
- **PostgreSQL**: Robust relational database
- **Migrations**: Database schema versioning
- **Seeding**: Default admin user creation

### 🧪 Testing
- **Unit Tests**: Comprehensive test coverage for use cases
- **E2E Tests**: Integration tests with isolated database instances
- **Vitest**: Modern testing framework
- **Test Doubles**: In-memory repositories for testing

### 🚀 DevOps & CI/CD
- **Docker**: Containerized application with PostgreSQL
- **GitHub Actions**: Automated testing workflows
- **Husky**: Git hooks for code quality
- **Commitlint**: Standardized commit messages
- **ESLint**: Code linting and formatting

### 📖 Documentation
- **Swagger**: Complete API documentation
- **OpenAPI**: Standardized API specification

## Project Structure

```
├── .github/workflows/          # CI/CD pipelines
├── .husky/                     # Git hooks
├── prisma/                     # Database schema and migrations
├── src/
│   ├── @types/                 # TypeScript type definitions
│   ├── docs/                   # Swagger documentation
│   ├── domains/                # Domain-specific logic
│   │   └── users/
│   │       ├── application/    # Use cases and repositories
│   │       └── factories/      # Dependency injection factories
│   ├── env/                    # Environment validation
│   ├── http/                   # HTTP layer
│   │   ├── controllers/        # Request handlers
│   │   ├── middlewares/        # Express middlewares
│   │   └── routes/             # Route definitions
│   ├── lib/                    # External libraries configuration
│   ├── repositories/           # Data access layer
│   └── utils/                  # Utility functions
├── test/                       # Test utilities and fixtures
├── docker-compose.yml          # Multi-container setup
└── Dockerfile                  # Application container
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RichardLirio/express-boilerplate.git
   cd express-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Using Docker (recommended)
   docker-compose up -d

   # Or manually with local PostgreSQL
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

### Docker Setup

Run the complete application stack with Docker:

```bash
docker-compose up -d
```

This will start:
- Express application on port 3333
- PostgreSQL database on port 5432

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Server port | `3333` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |

## API Documentation

Once the application is running, access the Swagger documentation at:
- Local: `http://localhost:3333/api-docs`

### Default Credentials

The application creates a default admin user:
- **Email**: `admin@example.com`
- **Password**: `admin123`

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio

# Testing
npm run test         # Run all tests
npm run test:e2e     # Run E2E tests
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

## Testing

### Unit Tests
```bash
npm run test
```

Tests are located alongside their respective use cases and focus on business logic validation.

### E2E Tests
```bash
npm run test:e2e
```

E2E tests use isolated database instances and test the complete request-response cycle.

## Development Notes

### ETag Handling
The application has ETag disabled globally as it was interfering with E2E tests. This decision was made with the intention of implementing Redis caching later.

### Rate Limiting
Implemented to prevent brute force attacks and ensure API stability.

### Authentication
JWT tokens are valid for 7 days and include proper middleware validation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test && npm run test:e2e`
5. Commit using conventional commits
6. Push to your fork
7. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Purpose

This boilerplate serves as:
- **Educational Resource**: Learn modern backend development practices
- **Project Foundation**: Solid starting point for scalable applications
- **Best Practices Reference**: Implementation of industry standards

The project evolved from a simple MVC structure to demonstrate the progression toward more sophisticated architectures, making it an excellent learning resource for developers at different skill levels.