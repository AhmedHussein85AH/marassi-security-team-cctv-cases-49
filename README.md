# Security Management System

A comprehensive security management system for CCTV cases, built with React, Node.js, and MongoDB.

## Project Structure

This is a monorepo containing both frontend and backend applications:

```
security-management-system/
├── frontend/           # React + Vite frontend application
├── backend/           # Node.js + Express backend application
├── package.json       # Root package.json for workspace management
└── README.md         # This file
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 6.0

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd security-management-system
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables according to your environment

4. Start the development servers:
   ```bash
   # Start both frontend and backend
   npm run dev

   # Start only frontend
   npm run dev:frontend

   # Start only backend
   npm run dev:backend
   ```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend
- `npm run test` - Run tests for both frontend and backend
- `npm run lint` - Run linting for both frontend and backend

### Frontend
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production
- `npm run test:frontend` - Run frontend tests
- `npm run lint:frontend` - Run frontend linting

### Backend
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend for production
- `npm run test:backend` - Run backend tests
- `npm run lint:backend` - Run backend linting

## Features

- User authentication and authorization
- CCTV case management
- Real-time incident reporting
- Report generation
- Multi-language support (English/Arabic)
- RTL layout support
- Responsive design

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query
- React Router
- Radix UI

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Express Validator

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

[Your License Here] 