# E-Lib Backend API

## Technologies & Libraries

**Language & Runtime**

- TypeScript 5.8.2
- Node.js

**Framework & Web Server**

- Express.js 5.1.0
- CORS 2.8.5

**Database**

- MongoDB (via Mongoose 8.13.2)

**Authentication & Security**

- JSON Web Tokens (jsonwebtoken 9.0.2)
- bcrypt 5.1.1 (password hashing)

**File Management & Cloud Storage**

- Multer 1.4.5-lts.2 (file upload handling)
- Cloudinary 2.6.0 (cloud file storage)

**Utilities**

- dotenv 16.4.7 (environment configuration)
- http-errors 2.0.0 (HTTP error handling)

**Development Tools**

- TypeScript 5.8.2
- ts-node 10.9.2
- Nodemon 3.1.9
- ESLint (TypeScript support)
- Prettier

## Project Overview

This is the Backend API component of the E-lib system — a REST API for an e-book library application built with Express.js and TypeScript. The API manages user authentication, book uploads, and book discovery. Users can register, log in, upload books with cover images and PDF files, and browse the book catalog. The application integrates with Cloudinary for persistent file storage.

## E-lib System (Integrated Components)

E-lib is a multi-repository, multi-component system composed of three cooperating parts:

- Backend API (this repository): central authority for authentication and authorization; validates resource ownership before write operations; exposes REST endpoints for users and books.
- Public Frontend (Next.js): read-only public-facing UI that lists and shows book details and provides downloads; no authentication required; consumes the Backend API.
- Authenticated Dashboard (React + Vite): user dashboard for full CRUD on books; requires JWT authentication; users can manage only their own books (backend enforces ownership).

These components operate together as a single E-lib system (not standalone projects). For development and testing, run the Backend API alongside the Frontend and Dashboard to exercise the full feature set.

### Public Frontend (Next.js) — summary

- Purpose: Public, read-only UI for browsing and downloading books. Consumes the Backend API.
- Key tech: Next.js, React, Tailwind CSS, Turbopack.
- Features: book listing, book detail pages, download functionality, cache management (cache API + invalidation webhook), server-side data fetching and cache-control headers.
- Run: `npm install` then `npm run dev` (default http://localhost:3000). Configure `BACKEND_URL` in `.env`.

### Authenticated Dashboard (React + Vite) — summary

- Purpose: Authenticated dashboard for users to manage their personal book collection (create/update/delete).
- Key tech: React, Vite, Zustand, TanStack React Query, Axios, React Hook Form, Zod, Tailwind CSS.
- Features: JWT-based authentication, protected routes, full CRUD for user-owned books, client-side state and form validation, integration with Backend API for enforcement of ownership.
- Run: `npm install` then `npm run dev` (default http://localhost:5173). Configure `VITE_BACKEND_URL` in `.env.local`.

Running the full E-lib system

- Recommended for local development: start the Backend API (this repo) and then run the Frontend and Dashboard (separate repos) so each component can call the Backend endpoints.
- The Backend is the single source of truth for authentication, user data, and book resources; Frontend and Dashboard are UI consumers with different permission scopes (public vs authenticated).

## Backend API

- Central authority for authentication and authorization
- Validates ownership before write operations

## Repository Structure

```
src/
├── app.ts              # Express application setup, routing, middleware configuration
├── server.ts           # Server initialization and database connection
├── Config/
│   ├── config.ts       # Environment variable configuration
│   ├── db.ts           # MongoDB connection setup
│   └── Cloudinary.ts   # Cloudinary client configuration
├── middlewares/
│   ├── authenticate.ts # JWT token verification middleware
│   └── globalErrorHandler.ts  # Global error handling middleware
├── user/
│   ├── userController.ts  # User registration and login logic
│   ├── userModel.ts       # User Mongoose schema
│   ├── userRouter.ts      # User API routes
│   └── userTypes.ts       # TypeScript interface for User
└── book/
    ├── bookControler.ts   # Book CRUD operations
    ├── bookModel.ts       # Book Mongoose schema
    ├── bookRouter.ts      # Book API routes
    └── bookTypes.ts       # TypeScript interface for Book

public/
└── data/
    └── uploads/        # Temporary storage for uploaded files (deleted after cloud upload)

ebook data/            # Local book data and metadata
tsconfig.json          # TypeScript compiler configuration
package.json           # Project dependencies and scripts
```

## Features / Implementations

- **User Management**

  - User registration with email and password
  - Password hashing using bcrypt
  - User login with JWT token generation (7-day expiration)
  - Token-based authentication for protected routes

- **Book Management**

  - Create books with metadata (title, author, genre, description)
  - Upload cover images and PDF files via multipart form data
  - Cloud storage integration via Cloudinary
  - Update existing books
  - List all books with pagination support
  - Retrieve individual book details
  - Delete books (authenticated users only)

- **File Handling**

  - Multipart form data parsing with Multer
  - File size limits (10 MB per file)
  - Temporary file cleanup after cloud upload
  - Cover image and PDF storage on Cloudinary

- **Error Handling**

  - Global error handling middleware
  - HTTP error codes with descriptive messages
  - Input validation for required fields

- **Security**
  - CORS configuration with configurable frontend domain
  - JWT token-based authentication
  - Password hashing with bcrypt

## Setup & Requirements

**Prerequisites**

- Node.js and npm
- MongoDB instance (local or remote connection string)
- Cloudinary account (for file storage)

**Installation**

1. Clone the repository
2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:
   ```
   PORT=5513
   MONGO_CONNECTION_STRING=<your_mongodb_connection_string>
   NODE_ENV=development
   JWT_SECRET=<your_jwt_secret>
   CLOUDINARY_CLOUD=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   FRONTEND_DOMAIN=<your_frontend_url>
   ```

## Usage

**Start the development server:**

```
npm run dev
```

The server will start on the port specified in the `PORT` environment variable (default: 5513).

**API Endpoints**

_User Routes_

- `POST /api/users/register` - Register a new user

  - Request body: `{ name, email, password }`
  - Response: `{ accessToken }`

- `POST /api/users/login` - Login user
  - Request body: `{ email, password }`
  - Response: `{ accessToken }`

_Book Routes_

- `POST /api/books` - Create a new book (requires authentication)

  - Request: multipart form data with fields: `title`, `genre`, `description`, `author`, `coverImage` (file), `file` (PDF)
  - Response: `{ id, message }`

- `PATCH /api/books/:bookId` - Update book (requires authentication)

  - Request: multipart form data with optional fields

- `GET /api/books` - List all books

  - Response: Array of book objects

- `GET /api/books/:bookId` - Get single book details

  - Response: Book object

- `DELETE /api/books/:bookId` - Delete book (requires authentication)
  - Response: Success message

**Authentication**
Include the JWT token in the Authorization header for protected routes:

```
Authorization: Bearer <token>
```

## Scope & Intent

This repository is an in-development backend service for an e-book library application. It demonstrates REST API design patterns, user authentication, file handling, and cloud storage integration. The project appears to be in active development with pending features listed in TODO.md.

## Limitations

- **Hardcoded Configuration**: Database connection details and Cloudinary credentials must be set via environment variables; no fallback defaults are provided
- **No Input Validation**: User input is checked for presence but lacks format validation (e.g., email format, password strength)
- **No Test Suite**: No unit or integration tests are present in the repository
- **Incomplete Features**: TODO.md indicates pending functionality (e.g., book count endpoint)
- **File Size Limits**: Maximum file size is capped at 10 MB due to Cloudinary limitations, though Multer is configured for larger files
- **Error Handling**: Some error messages lack specific details about validation failures
- **Database Indexing**: No explicit database indexes are configured for common queries
- **Rate Limiting**: No rate limiting or throttling mechanisms are implemented
- **Logging**: Console-based logging only; no structured logging system

## Contributing

When contributing, ensure code follows the existing patterns established in the codebase. TypeScript types should be defined in dedicated `*.types.ts` files. Controllers should handle business logic with proper error handling. Routes should use the established middleware pattern.

## License

No license is specified in this repository.
