# E-Lib Backend API

## Technologies & Libraries

**Language & Runtime**

- TypeScript 5.8.2
- Node.js

**Framework & Web Server**

**Database**

**Authentication & Security**

- JSON Web Tokens (jsonwebtoken 9.0.2)
- bcrypt 5.1.1 (password hashing)

- Multer 1.4.5-lts.2 (file upload handling)
  **Utilities**

**Development Tools**

- Prettier

## Project Overview

This is the Backend API component of the E-lib system — a REST API for an e-book library application built with Express.js and TypeScript. The API manages user authentication, book uploads, and book discovery. Users can register, log in, upload books with cover images and PDF files, and browse the book catalog. The application integrates with Cloudinary for persistent file storage.

## E-lib System (Integrated Components)

- Authenticated Dashboard (React + Vite): user dashboard for full CRUD on books; requires JWT authentication; users can manage only their own books (backend enforces ownership).

These components operate together as a single E-lib system (not standalone projects). For development and testing, run the Backend API alongside the Frontend and Dashboard to exercise the full feature set.

### Public Frontend (Next.js) — summary

- Purpose: Public, read-only UI for browsing and downloading books. Consumes the Backend API.
- Key tech: Next.js, React, Tailwind CSS, Turbopack.
- Features: book listing, book detail pages, download functionality, cache management (cache API + invalidation webhook), server-side data fetching and cache-control headers.
- Run: `npm install` then `npm run dev` (default http://localhost:3000). Configure `BACKEND_URL` in `.env`.
- Purpose: Authenticated dashboard for users to manage their personal book collection (create/update/delete).
- Key tech: React, Vite, Zustand, TanStack React Query, Axios, React Hook Form, Zod, Tailwind CSS.
  Running the full E-lib system

## Backend API

- Central authority for authentication and authorization

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

```
Elib.postman_collection.json   # Postman API collection (for API testing)

## Features / Implementations
- Password hashing using bcrypt
- User login with JWT token generation (7-day expiration)
- Update existing books
- List all books with pagination support

- Multipart form data parsing with Multer

**Error Handling**
- Input validation for required fields
**Security**
- CORS configuration with configurable frontend domain
- JWT token-based authentication
- Password hashing with bcrypt

**Testing**
- Node.js and npm
- MongoDB instance (local or remote connection string)
- Cloudinary account (for file storage)

**Installation**

2. Install dependencies:

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
- `POST /api/users/login` - Login user

  - Request body: `{ email, password }`
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

The repository includes a Postman collection file (`Elib.postman_collection.json`) for testing API endpoints. Import this file into Postman to run predefined requests and tests.

## Scope & Intent

This repository is an application backend for an e-book library system. It is intended as a demonstration or reference implementation of REST API design, authentication, file handling, and cloud storage integration.

## Limitations

- Configuration is required via environment variables; no fallback defaults.
- Input validation is minimal; format and strength checks are not enforced.
- No unit or integration tests are present.
- Some features may be incomplete (see TODO.md).
- File size limits are enforced for uploads.
- Error messages may lack detailed validation information.
- No explicit database indexing or rate limiting.
- Logging is limited to console output.

## Contributing

Contributions should follow existing code patterns and TypeScript conventions. Define types in dedicated files and use established middleware and controller structures.

## License

No license is specified in this repository.

```

```
