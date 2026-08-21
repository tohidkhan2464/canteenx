# CanteenX - University Cafeteria Management System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)

**CanteenX** is a comprehensive cafeteria management system designed for educational institutions. It streamlines the process of ordering, managing, and delivering food to students and staff, reducing queues and improving efficiency.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started / Setup Instructions](#getting-started--setup-instructions)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [License](#license)
- [Contact](#contact)

## Features

### For Students
- **Order Food**: Browse menus and place orders
- **Schedule Orders**: Set specific times for pickup/delivery
- **Real-time Tracking**: Track order status
- **Notifications**: Get updates on order preparation and delivery
- **Digital Wallet**: Integrated payment system

### For Kitchen Staff
- **Order Management**: View and manage incoming orders
- **Menu Management**: Update menu items, prices, and availability
- **Kitchen Dashboard**: Real-time overview of pending orders
- **Order Preparation**: Mark orders as in-progress and completed
- **Stock Management**: Track ingredient levels

### For Delivery Staff
- **Delivery Routes**: Optimized delivery routes
- **Order Tracking**: Real-time location tracking
- **Delivery Confirmation**: Mark orders as delivered
- **Delivery History**: Track delivery performance

### For Admins
- **All Staff Features**
- **Menu Management**: Complete control over menus
- **Order Analytics**: Detailed reports and statistics
- **User Management**: Manage student, staff, and delivery accounts
- **System Configuration**: Manage business hours and settings
- **Billing Management**: Manage payments and transactions

## Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: React Context API, Zustand
- **Forms**: React Hook Form, Zod
- **HTTP Client**: Axios, TanStack Query
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Web Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **ORM/ODM**: Mongoose
- **Authentication**: JWT, bcrypt
- **Validation**: Joi
- **Payment Gateway**: Stripe (planned)
- **Real-time**: Socket.io

### Tools
- **Build Tool**: Next.js Build System
- **Package Manager**: npm, yarn, or pnpm
- **Version Control**: Git
- **Hosting**: Vercel (Frontend), Render/AWS (Backend)

## Project Structure

```
canteenx/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes
│   ├── admin/        # Admin section
│   ├── kitchen/      # Kitchen staff section
│   ├── delivery/     # Delivery staff section
│   └── student/      # Student section
├── components/       # Reusable UI components
├── lib/              # Utility functions and helpers
├── models/           # Mongoose models
├── routes/           # API route handlers
├── services/         # Business logic and external services
├── middleware/       # Express middleware
├── public/           # Static assets
├── .env.example      # Environment variable template
└── package.json      # Project dependencies and scripts
```

## Getting Started / Setup Instructions

Follow these steps to set up the project on your local machine after cloning the repository:

1. **Navigate to the project directory:**
   ```bash
   cd canteenx
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

3. **Set up environment variables:**
   Copy the `env.example` file to `.env` and fill in the required variables.
   ```bash
   cp env.example .env
   ```
   *Required variables in `.env`:*
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

4. **Run the development server:**
   ```bash
   npm run dev
   # or yarn dev / pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
