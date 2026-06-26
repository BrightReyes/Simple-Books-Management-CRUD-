<h1 align="center">
  📚 Simple Books Management (CRUD)
</h1>

<p align="center">
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/></a>
  <a href="https://reactjs.org/" target="_blank"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/></a>
  <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/></a>
  <a href="https://www.prisma.io/" target="_blank"><img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma"/></a>
  <a href="https://vitejs.dev/" target="_blank"><img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"/></a>
</p>

<p align="center">
  A robust, full-stack web application designed to facilitate book management and assignment between <b>Teachers</b> and <b>Students</b>. Built with modern web development practices focusing on clean architecture, security, and exceptional user experience.
</p>

---

## 🌟 Key Features

### 🎓 For Teachers
* **Role-Based Access Control:** Secure JWT authentication to ensure strict separation of concerns.
* **Comprehensive Book Management:** Full CRUD capabilities for books including custom cover image uploads.
* **Advanced Assignments:** Assign books to students seamlessly via a dedicated page or through an interactive, inline modal.
* **Smart Data Integrity:** Backend and frontend validation to prevent duplicate assignments (a student cannot be assigned the same book twice).
* **Powerful Search & Sort:** Real-time search by title and description, and alphabetical or chronological sorting on the Dashboard and Management pages.
* **Pagination:** Scalable data fetching with built-in API pagination.

### 🎒 For Students
* **Secure Access:** Dedicated student login portal.
* **Personalized Dashboard:** Clean interface to view only the books explicitly assigned to them by their teachers.

---

## 🏗️ Technical Architecture

This application strictly adheres to the **MVVM (Model-View-ViewModel)** architectural pattern on the frontend and a scalable, modular architecture on the backend.

### Backend (NestJS + Prisma + PostgreSQL)
- **Framework:** NestJS leveraging TypeScript for robust typing.
- **Database:** PostgreSQL for reliable, relational data storage.
- **ORM:** Prisma Client for type-safe database queries and automated migrations.
- **Security:** `bcrypt` for password hashing, and `@nestjs/jwt` for stateless authentication.
- **API Documentation:** Auto-generated Swagger documentation for rapid testing and integration.

### Frontend (React + Vite)
- **Framework:** React.js bootstrapped with Vite for lightning-fast HMR and optimized builds.
- **Styling:** Custom, modern CSS utilizing CSS variables, flexbox/grid, and elegant glassmorphic components (`backdrop-filter`).
- **State Management:** Custom React Hooks (`useBooks`, `useAssignments`, `useAuth`) abstracting logic away from UI components (ViewModel).
- **Routing:** `react-router-dom` for seamless SPA navigation.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need the following installed on your machine:
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **PostgreSQL** (v14.x or higher)

### 1. Database Setup
Create a new PostgreSQL database on your local machine:
```sql
CREATE DATABASE simple_books_db;
```

### 2. Backend Initialization
Navigate to the `backend` directory to set up the server environment:

```bash
cd backend
npm install
```

Configure your environment variables by creating a `.env` file in the `backend` directory (a `.env.example` is provided):
```env
# backend/.env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/simple_books_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
```

Run database migrations, generate the Prisma client, and seed the database with initial dummy data:
```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

Start the backend development server:
```bash
npm run start:dev
```
*The backend API will run on `http://localhost:3000`.*

### 3. Frontend Initialization
Open a new terminal window and navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```
*The frontend application will run on `http://localhost:5173`.*

---

## 🔐 Demo Credentials

After seeding the database, you can log in using the following test accounts:

| Role | Username | Password |
|------|----------|----------|
| **Teacher** | `teacher1` | `password123` |
| **Student** | `student1` | `password123` |
| **Student** | `student2` | `password123` |

---

## 📖 API Documentation (Swagger)

The backend features fully automated Swagger documentation. Once the backend server is running, navigate to:

👉 **[http://localhost:3000/api](http://localhost:3000/api)**

Here you can view all available endpoints, required DTOs, query parameters (such as `page` and `limit` for pagination), and test the API directly from your browser.

---

## 🗄️ Database Schema (ERD)

The database consists of three primary models connected via a Many-to-Many relationship using an explicit join table (`BookAssignment`).

```mermaid
erDiagram
    USER ||--o{ BOOK : creates
    USER ||--o{ BOOK_ASSIGNMENT : receives
    BOOK ||--o{ BOOK_ASSIGNMENT : has

    USER {
        Int id PK
        String username
        String password
        Role role "TEACHER or STUDENT"
    }
    
    BOOK {
        Int id PK
        String title
        String description
        String coverImage
        Int teacherId FK
    }
    
    BOOK_ASSIGNMENT {
        Int studentId PK, FK
        Int bookId PK, FK
    }
```
*Note: `BOOK_ASSIGNMENT` utilizes a composite primary key (`studentId`, `bookId`) enforcing uniqueness at the database level to prevent duplicate assignments.*

---

## 📁 Project Structure

```text
├── backend/
│   ├── prisma/             # Database schema, migrations, and seed scripts
│   ├── src/
│   │   ├── auth/           # Authentication logic and JWT Guards
│   │   ├── books/          # Book CRUD operations
│   │   ├── users/          # User management operations
│   │   └── main.ts         # Application entry point and Swagger config
│   └── uploads/            # Local storage for uploaded cover images
│
└── frontend/
    ├── src/
    │   ├── api/            # Axios API client wrapper
    │   ├── components/     # Reusable UI components (Cards, Modals, Navbar)
    │   ├── context/        # React Context (AuthContext)
    │   ├── hooks/          # Custom hooks handling business logic (useBooks)
    │   ├── pages/          # Application views (Dashboard, Login, ManageBooks)
    │   └── index.css       # Global styling and CSS variables
    └── index.html
```

---

<p align="center">
  <i>Developed to demonstrate industry-standard full-stack development practices.</i>
</p>
