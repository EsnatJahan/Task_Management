# Task Management System

A full-stack, responsive Task Management application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Node.js (Express 5)**, **Prisma ORM 6**, and **PostgreSQL**.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture & Directory Structure](#architecture--directory-structure)
- [Database Schema & Migrations](#database-schema--migrations)
- [REST API Reference](#rest-api-reference)
- [Setup & Installation](#setup--installation)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
  - [Docker Setup](#docker-setup)
  - [One-Click Run Scripts](#one-click-run-scripts)
- [Error Handling & Validation](#error-handling--validation)
- [PWA Integration](#pwa-integration)

---

## Project Overview

Task Management enables users to create and manage multiple workspaces/projects, track project progress with live completion percentages, and manage tasks under each project.

### Key Features
- **Project Workspaces**: Create, view, and delete projects with cascade task deletion.
- **Task Management**: Create, view, edit, and delete tasks under specific projects.
- **Progress Tracking**: Real-time project metrics (Total, Pending, In Progress, Completed) and completion progress bar.
- **Filter Tabs**: Instant filtering of tasks by status (`All`, `Pending`, `In Progress`, `Completed`) with dynamic count badges.
- **One-Click Completion**: Checkbox on task cards for toggling task status directly.
- **Clean SaaS UI/UX**: Soft modern color accents, non-bold typography, responsive mobile-friendly layouts, and modal dialogs.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons |
| **Backend** | Node.js, Express 5, CORS, dotenv |
| **Database & ORM** | PostgreSQL, Prisma ORM 6 |


---

## Architecture & Directory Structure

```
Task_Management/
├── backend/
│   ├── prisma/
│   │   ├── migrations/           # Database migration files
│   │   └── schema.prisma         # Prisma schema definition
│   ├── src/
│   │   ├── config/database.js    # Prisma client singleton
│   │   ├── controllers/          # Express route controllers (project, task)
│   │   ├── routes/               # Express REST routers
│   │   ├── app.js                # Express app setup & middleware
│   │   └── server.js             # Server startup & DB connection
│   ├── .env.example              # Environment variables template
│   ├── Dockerfile                # Backend container configuration
│   └── package.json
├── frontend/
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── components/           # UI Components (Sidebar, Header, TaskList, Modals)
│   │   ├── api.ts                # Frontend REST API client
│   │   ├── App.tsx               # Main stateful dashboard component
│   │   └── main.tsx              # React DOM entry point
│   ├── Dockerfile                # Multi-stage frontend container configuration
│   └── package.json
├── docker-compose.yml            # Full-stack Docker orchestration
└── README.md
```

---

## Database Schema & Migrations

Managed with **Prisma ORM** targeting **PostgreSQL**.

### Schema Models

```prisma
model Project {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime @default(now())
  tasks       Task[]
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  priority    String   // "Low" | "Medium" | "High"
  status      String   // "Pending" | "In Progress" | "Completed"
  createdAt   DateTime @default(now())

  projectId   Int
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

- Initial migration: `backend/prisma/migrations/20260928104312_init/migration.sql`
- Foreign Key: `Task.projectId -> Project.id` with `ON DELETE CASCADE`.

---

## REST API Reference

All routes are prefixed with `/api`.

### Projects

| Method | Endpoint | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | List all projects with task count | None | `200 OK` |
| `POST` | `/api/projects` | Create a new project | `{ "name": string, "description"?: string }` | `201 Created` |
| `DELETE` | `/api/projects/:id` | Delete a project & its tasks | None | `200 OK`, `404` |

### Tasks

| Method | Endpoint | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks?projectId=:id` | Get tasks for a project | None | `200 OK` |
| `POST` | `/api/tasks` | Create task in project | `{ "title": string, "description"?: string, "priority": string, "status": string, "projectId": number }` | `201 Created` |
| `PUT` | `/api/tasks/:id` | Update task details / status | `{ "title"?: string, "description"?: string, "priority"?: string, "status"?: string }` | `200 OK`, `404` |
| `DELETE` | `/api/tasks/:id` | Delete a task | None | `200 OK`, `404` |

---

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd Task_Management
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   cp .env.example .env
   # Update DATABASE_URL in .env if needed
   npm install
   npx prisma migrate dev
   npm run dev
   ```
   Backend runs at: `http://localhost:5000`

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Frontend runs at: `http://localhost:5173`

---
