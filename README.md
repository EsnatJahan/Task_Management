# Task Management System

A full-stack, responsive Task Management application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Node.js**, **Express**, **Prisma ORM 6**, and **PostgreSQL**.

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
- [Error Handling & Validation](#error-handling--validation)

---

## Project Overview

Task Management is a web-based application that allows users to create and manage projects and the tasks associated with each project.

### Key Features

- **Project Management**: Create, view, and delete projects.
- **Task Management**: Create, view, edit, update, and delete tasks.
- **Task Status**: Manage tasks using `Pending`, `In Progress`, and `Completed` statuses.
- **Task Priority**: Set task priority as `Low`, `Medium`, or `High`.
- **Task Filtering**: Filter tasks by status.
- **Project-Based Tasks**: Each task belongs to a specific project.
- **Task Completion**: Update task status directly from the task card.
- **Responsive UI**: Mobile-friendly interface built with React and Tailwind CSS.
- **Form Validation**: Required fields are validated before submitting forms.
- **Empty States**: Displays appropriate messages when a project has no tasks.
- **Delete Confirmation**: Confirmation is shown before deleting projects or tasks.
- **Loading and Error States**: Provides feedback during API operations and when errors occur.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React |
| **Backend** | Node.js, Express, CORS, dotenv |
| **Database & ORM** | PostgreSQL, Prisma ORM 6 |

---

## Architecture & Directory Structure

```text
Task_Management/
├── backend/
│   ├── prisma/
│   │   ├── migrations/           # Database migration files
│   │   └── schema.prisma         # Prisma schema
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # Prisma client
│   │   ├── controllers/          # API controllers
│   │   ├── routes/               # Express routes
│   │   ├── app.js                # Express app configuration
│   │   └── server.js             # Server startup
│   ├── .env.example              # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # React UI components
│   │   ├── api.ts                # API requests
│   │   ├── App.tsx               # Main application component
│   │   └── main.tsx              # React entry point
│   └── package.json
│
└── README.md
