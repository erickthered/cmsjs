# Development Plan: Modern CMS

This document outlines the development plan for creating a new, modern CMS from scratch, featuring separate backend and frontend applications.

## Guiding Principles

- **TypeScript:** Utilize TypeScript for both frontend and backend to enhance code quality, maintainability, and developer experience.
- **Best Practices:** Adhere to modern development best practices, including clean code, clear architecture, and comprehensive testing.
- **Scalability:** Build the application with scalability in mind, allowing for future feature growth.
- **Maintainability:** Ensure the codebase is well-documented, structured, and easy to maintain.
- **Security:** Implement security best practices from the start, especially for authentication, authorization, and data handling.

---

## Phase 1: Backend Foundation & Setup

**Goal:** Establish the core structure, configuration, and authentication for the backend API.

1.  **Project Setup:**
    *   Create a new directory for the backend project.
    *   Initialize a Node.js project: `npm init -y`.
    *   Install core dependencies: `express`, `mongoose`, `dotenv`, `cors`.
    *   Install development dependencies: `nodemon`, `jest`, `supertest`, `typescript`, `@types/express`, `@types/node`, `@types/cors`, `@types/jest`, `@types/supertest`.
    *   Configure TypeScript: Create `tsconfig.json` and update `package.json` scripts for building and running TypeScript.
    *   Set up a basic Express server in `src/app.ts`.

2.  **Configuration:**
    *   Implement `.env` file support using `dotenv`.
    *   Define environment variables for `PORT`, `MONGO_URI`, and `REDIS_URL`.
    *   Create a config module to handle database connections (MongoDB and Redis).

3.  **Models & Database:**
    *   Define the Mongoose schemas for:
        *   `User`: `email`, `fullName`, `nickName`, `profile`, `group` ('admin' | 'editor'), `password` (hashed).
        *   `Category`: `name`, `slug`, `description`, `position`.
        *   `Article`: `title`, `category` (ref), `slug`, `keywords`, `description`, `summary`, `content`.
        *   `Settings`: A single document model for all site settings.

4.  **User Authentication & Authorization:**
    *   Implement user registration and login endpoints.
    *   Use `bcrypt` to hash passwords.
    *   Use JSON Web Tokens (JWT) for session management.
    *   Create middleware to protect routes and verify user roles (`isAdmin`, `isEditor`).
    *   Implement logic to make the first registered user an `admin`.

5.  **Testing Setup:**
    *   Configure Jest for API testing.
    *   Write initial tests for the authentication endpoints.

---

## Phase 2: Core Backend API Development

**Goal:** Build out all the necessary CRUD endpoints for managing the CMS content and settings.

1.  **User Management API:**
    *   Create secure CRUD endpoints for administrators to manage users.

2.  **Category Management API:**
    *   Create CRUD endpoints for administrators to manage categories.
    *   Implement logic to auto-generate the `slug` from the `name` if not provided, ensuring it's unique.

3.  **Article Management API:**
    *   Create CRUD endpoints for admins and editors to manage articles.
    *   Ensure editors can only manage their own articles (or all articles, as per final requirements).

4.  **Settings API:**
    *   Create endpoints for administrators to get and update the site settings.
    *   Settings to include: `googleTagManagerId`, `customJs`, `customCss`, `maintenanceMode`, `userRegistration`, `theme`, `caching`.

5.  **API Documentation & Testing:**
    *   Write comprehensive integration tests for all API endpoints.
    *   (Optional) Set up Swagger or a similar tool for API documentation.

---

## Phase 3: Frontend Foundation & Setup

**Goal:** Initialize the frontend project and establish the core structure for the user interface.

1.  **Project Setup:**
    *   Create a new directory for the frontend project.
    *   Initialize a new project using Vite: `npm create vite@latest frontend -- --template react-ts`.
    *   Install core dependencies: `react-router-dom`, `axios`, `bootstrap`, `react-bootstrap`.
    *   Install development dependencies: `vitest`, `@testing-library/react`.

2.  **Project Structure:**
    *   Organize the project into logical folders: `pages`, `components`, `services`, `contexts`, `hooks`, `themes`.

3.  **Styling and Theming:**
    *   Import Bootstrap CSS into the main application file.
    *   Create the directory structure for themes: `src/themes/default`.
    *   Plan a strategy for dynamically loading theme styles and overriding Bootstrap variables.

4.  **API Integration:**
    *   Create a dedicated service layer (e.g., `services/api.js`) using `axios` to handle all communication with the backend.

5.  **Routing:**
    *   Set up `react-router-dom` to handle public routes and private (admin) routes.

---

## Phase 4: Frontend Admin Panel Development

**Goal:** Build the complete administrative interface for managing the CMS.

1.  **Authentication:**
    *   Create a login page.
    *   Implement logic to store JWTs securely and manage authenticated state (e.g., using a React Context).
    *   Create a private route component that redirects unauthenticated users to the login page.

2.  **Dashboard Layout:**
    *   Design and build the main admin dashboard layout, including navigation for different management sections.

3.  **Management Interfaces:**
    *   Build the UI (forms, tables, modals) for CRUD operations on:
        *   Articles
        *   Categories
        *   Users

4.  **Settings Panel:**
    *   Create the form for updating all site settings.

5.  **Testing:**
    *   Write unit and integration tests for all major components and pages in the admin panel.

---

## Phase 5: Frontend Public Website & Finalization

**Goal:** Develop the public-facing website and prepare for deployment.

1.  **Public Pages:**
    *   Create the main pages for the public website:
        *   Homepage (listing articles).
        *   Category page (listing articles in that category).
        *   Article detail page.

2.  **Theme Implementation:**
    *   Implement the "default" theme, applying styles to all public pages.
    *   Ensure the frontend can dynamically apply settings from the backend (e.g., custom CSS/JS, GTM ID).

3.  **Responsiveness:**
    *   Thoroughly test and refine the responsiveness of both the admin panel and the public website.

4.  **End-to-End Testing:**
    *   Perform comprehensive end-to-end testing of the entire application flow.

5.  **Build & Deployment:**
    *   Create production build scripts for both the frontend and backend.
    *   Document the deployment process.
