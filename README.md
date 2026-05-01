# Team Task Manager (Fullstack SaaS)

A professional, minimal Team Task Manager built with React (Vite), Node.js (Express), MySQL (Sequelize), and Tailwind CSS.

## Features
- **JWT Auth**: Secure login/signup.
- **Role-Based Access**: Admins create projects/tasks; Members update status.
- **Project Management**: Create projects, add/remove members.
- **Task Tracking**: Assign tasks with deadlines and track progress.
- **Dashboard**: Real-time stats (Total, Completed, Pending, Overdue).
- **Responsive UI**: Modern SaaS dashboard with Indigo theme.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide Icons, Axios, React Router.
- **Backend**: Node.js, Express, Sequelize ORM, JWT, Bcrypt, Express Validator.
- **Database**: MySQL.

## Prerequisites
- Node.js installed.
- MySQL server running.
- A database named `Taskmanager` created.

## Installation

### 1. Database Setup
Create the database in MySQL:
```sql
CREATE DATABASE Taskmanager;
```

### 2. Backend Setup
```bash
cd backend
npm install
# Update .env with your MySQL credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Running the App
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Database Schema (Sequelize)
- **Users**: id, name, email, password, role (admin/member).
- **Projects**: id, title, description, created_by.
- **ProjectMembers**: user_id, project_id.
- **Tasks**: id, title, description, status, assigned_to, project_id, deadline.

## Deployment Tips
- **Railway**: Connect your repo, add MySQL service, and set environment variables.
- **Vercel**: Deploy the `frontend` folder, set `VITE_API_URL` to your Railway backend URL.
