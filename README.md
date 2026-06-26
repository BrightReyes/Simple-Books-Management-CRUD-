# 📚 Simple Books Management (CRUD)

A full-stack web application for managing books between **Teachers** and **Students**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Backend API | NestJS |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |

## Features

### Teacher
- Login with username and password
- Create books (title, description, cover image)
- Assign books to students
- Duplicate assignment prevention

### Student
- Login with username and password
- View assigned books

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm

### 1. Setup Database

Create a PostgreSQL database named `simple_books_db`.

### 2. Backend Setup

```bash
cd backend
npm install

# Update .env with your PostgreSQL credentials
# DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/simple_books_db?schema=public"

# Run Prisma migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed the database
npx prisma db seed

# Start the server
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Demo Accounts

| Username | Password | Role |
|---|---|---|
| teacher1 | password123 | Teacher |
| student1 | password123 | Student |
| student2 | password123 | Student |

## API Endpoints

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | /auth/login | ❌ | — | Login |
| GET | /users/students | ✅ | TEACHER | List students |
| GET | /users/profile | ✅ | ALL | Get profile |
| POST | /books | ✅ | TEACHER | Create book |
| GET | /books | ✅ | TEACHER | List teacher's books |
| GET | /books/all | ✅ | ALL | List all books |
| GET | /books/:id | ✅ | ALL | Get book |
| POST | /assignments | ✅ | TEACHER | Assign book |
| GET | /assignments/my-books | ✅ | STUDENT | Get assigned books |
| GET | /assignments | ✅ | TEACHER | Get assignments |

## ERD

```
USER (1) ──── (M) BOOK
USER (1) ──── (M) BOOK_ASSIGNMENT (M) ──── (1) BOOK
```

- **USER**: id, username, password, role (TEACHER/STUDENT)
- **BOOK**: id, title, description, cover_image, created_by_teacher_id
- **BOOK_ASSIGNMENT**: student_id (PK,FK), book_id (PK,FK) — composite primary key
