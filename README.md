# AutoHub Enterprise Edition: Setup & Execution Guide

This guide will help you deploy the standalone AutoHub Enterprise instance on your local machine.

## Prerequisites
*   **Go** (v1.21+)
*   **Node.js** (v18+) & **npm**
*   **PostgreSQL** (Active instance)

---

## 1. Database Setup
1.  Ensure PostgreSQL is running.
2.  Create a database named `postgres` (or as specified in your `.env`).
3.  Run the seed script to populate initial inventory:
    ```bash
    psql -h localhost -U postgres -d postgres -f seed_cars.sql
    ```
    *(Note: Check your `.env` for the correct port if it's not the default 5432.)*

---

## 2. Backend Execution (Go REST API)
1.  Open your terminal in the root directory.
2.  Ensure your `.env` file matches your local DB credentials.
3.  Run the server:
    ```bash
    go run cmd/main.go
    ```
    The server will start on `http://localhost:8080`.

---

## 3. Frontend Execution (React SPA)
1.  Open a new terminal window.
2.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Launch the development server:
    ```bash
    npm run dev
    ```
    The UI will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## 4. Default Credentials (For Admin Access)
*   **Registration**: You can register a new operator at `/register`.
*   **Login**: Access the system control center at `/login`.

---
**AutoHub Enterprise** — *Enterprise-grade infrastructure for independent dealerships.*
