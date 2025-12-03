# PLAN

## 1. Objective

Build a small but production-ready **Quiz Management System** with:

- **Admin panel** – create and manage quizzes.
- **Public experience** – anyone can take a quiz via a public page.
- **Results** – show score + correct answers after completion.
- **Role-based access** – `admin` vs `user`.

Tech stack:

- **Frontend**: React (Vite) + React Router + Redux Toolkit + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Auth**: JWT (JSON Web Tokens)
- **Deployment**:  
  - Backend → Render (Web Service)  
  - Frontend → (Vercel / Netlify / Render static site – TBD)

---

## 2. Assumptions

1. **User types**
   - There are two roles:
     - `admin` – can manage quizzes.
     - `user` – can log in and view dashboard, but quiz taking is public and does not require login.
   - Admin accounts will be created either:
     - via the `/auth/register` endpoint with `role: "admin"` during development, or
     - manually in the DB for production.

2. **Quiz access**
   - Quizzes marked `isPublic: true` are visible on the public quiz list and can be taken without authentication.
   - Only admins can create/update/delete quizzes.

3. **Question types supported**
   - `mcq` (multiple choice)
   - `true_false`
   - `text` (short free-text answer)
   - For now:
     - `text` answers are evaluated by **exact match, case-insensitive**.
     - No partial credit or advanced NLP matching.

4. **Scoring**
   - Each question carries equal weight (1 point).
   - Score = number of correct answers.
   - Percentage = `score / totalQuestions * 100`.

5. **Non-functional**
   - Single small app; no microservices.
   - Simple error handling/logging (console + JSON error responses).
   - No rate limiting, analytics, or comprehensive monitoring (out of scope for this assignment).
   - Basic CORS setup to allow the deployed frontend origin.

---

## 3. Scope

### 3.1 In Scope

- **Authentication**
  - Register / Login with email + password.
  - JWT issued on login/registration.
  - Role stored in JWT payload and in user document.

- **Admin Panel**
  - Create quiz with:
    - Title
    - Description
    - Visibility flag (`isPublic`)
    - Questions array (mixed types: MCQ, True/False, Text).
  - List quizzes (for admin).
  - View a single quiz with correct answers (admin).
  - Update existing quizzes (title, description, questions, visibility).
  - Delete quizzes.

- **Public Quiz Experience**
  - Public landing / dashboard listing all public quizzes (`GET /api/quizzes/public`).
  - Quiz detail page for taking a quiz (questions shown without correct answers).
  - Form to submit answers:
    - MCQ → select one option
    - True/False → radio buttons
    - Text → textarea
  - Result page:
    - Score
    - Percentage
    - Per-question correctness (user answer vs correct answer).

- **State Management & UI**
  - Global auth state handled via Redux Toolkit:
    - `user`, `token`, `loading`, `error`.
  - Protected routes (React Router) based on role.
  - Tailwind CSS for modern responsive UI:
    - Header with Logout
    - Admin quiz creation form
    - User dashboard and quiz-taking pages.

- **Deployment**
  - Backend deployed to Render as a Web Service (root directory `server`).
  - Environment variables configured on Render (e.g. `MONGO_URI`, `JWT_SECRET`).
  - Frontend configured to talk to backend via Render URL.

### 3.2 Out of Scope (for now)

- User signup for admins through UI (admin seeding handled manually).
- Email verification, password reset, or OAuth login.
- Advanced quiz analytics (charts, history per user).
- Timed quizzes / question shuffling.
- Pagination / search on quiz listings.
- i18n or accessibility audits beyond basic semantic usage.

---

## 4. High-Level Architecture

### 4.1 Overview

Monolithic MERN architecture:

- **Client (React)**
  - Communicates with backend via REST API.
  - Manages auth and basic UI state via Redux.
  - Uses React Router for navigation:
    - `/` – public quiz list
    - `/login`
    - `/register`
    - `/quiz/:id` – take quiz
    - `/dashboard` – user dashboard (list of quizzes)
    - `/admin/quizzes/new` – create quiz (admin only)
    - (optional) `/admin/quizzes` – admin quiz list

- **Server (Express)**
  - REST API under `/api`
  - Auth:
    - `/api/auth/register`
    - `/api/auth/login`
  - User routes:
    - `/api/user/me` – get profile (requires auth)
  - Admin routes:
    - `/api/admin/quizzes` – CRUD for quizzes (requires auth + admin role)
  - Public quiz routes:
    - `/api/quizzes/public`
    - `/api/quizzes/:id`
    - `/api/quizzes/:id/submit`

- **Database (MongoDB Atlas)**
  - Collections: `users`, `quizzes`, `quizattempts`.

- **Auth Flow**
  - On login/registration, backend returns `{ user info + JWT token }`.
  - Frontend stores token in `localStorage` and in Redux state.
  - Axios interceptor attaches `Authorization: Bearer <token>` for protected calls.
  - Backend `protect` middleware verifies token and attaches `req.user`.
  - `requireRole("admin")` middleware enforces admin-only routes.

---

## 5. Data Schema

### 5.1 User Schema

```ts
User {
  _id: ObjectId
  name: string
  email: string (unique, lowercase)
  password: string (hashed, bcrypt)
  role: "user" | "admin" (default: "user")
  createdAt: Date
  updatedAt: Date
}
