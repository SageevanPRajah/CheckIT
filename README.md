# Project Setup Guide

## 📌 Clone the Repository

```bash
git clone <repo-url>
cd <project-folder>
```

## 🔧 Backend (Spring Boot) Setup

1. Navigate to the backend directory:

```bash
cd nexus-backend
```

2. Install **Java (JDK 17 or latest)**
3. Use **Maven** to install dependencies:

```bash
./mvnw clean install
```

4. Run the application using:

```bash
./mvnw spring-boot:run
```

### 🏗 Recommended Backend Folder Structure

The backend follows a **Maven Java Project** structure. Below is a suggested structure for the **LMS and Auth applications**:

```
backend/
  ├── nexus/ (Main backend folder)
  │   ├── src/
  │   │   ├── main/
  │   │   │   ├── java/com/roboticgen/nexus/
  │   │   │   │   ├── config/        # Security and application configurations
  │   │   │   │   ├── controllers/   # REST API controllers
  │   │   │   │   ├── dto/           # Data Transfer Objects (Request & Response)
  │   │   │   │   ├── exceptions/    # Custom exceptions handling
  │   │   │   │   ├── models/        # Database entities
  │   │   │   │   ├── repositories/  # Database repositories
  │   │   │   │   ├── services/      # Business logic and service layer
  │   │   │   │   ├── utils/         # Utility classes and helper functions
  │   │   │   ├── resources/
  │   │   │   │   ├── application.propeties # Configuration file
  │   │   ├── test/                   # Unit and Integration tests
  │   ├── pom.xml                      # Maven configuration file
```

### 📌 Additional Notes:

- **Authentication (`Auth`)**: The authentication logic should be inside the `auth` package within `services`, `controllers`, and `repositories`.
- **LMS Functionality**: LMS-related logic (e.g., courses, users, enrollments) should be modularized within separate service layers.

## 🎨 Frontend (Next.js) Setup

1. Install **Node.js** (LTS version recommended)
2. Navigate to the frontend directory:

```bash
cd nexus-frontend
npm install
npm run dev
```

## 🏗️ Frontend Project Structure & Guidelines

### 🗂 Type Definitions

- If you are using any new **type** or **interface**, create it inside the `types` folder before using it elsewhere. This helps keep type definitions organized and reusable.

### 📁 Component Organization

- The `components` folder contains reusable UI components.
- The `ui` folder stores essential, reusable UI elements like buttons, inputs, and modals.
- The `lib` folder contains utility functions, hooks, and other shared logic that can be used across the project.

🚀 **Now you're all set up! Let me know if you have any issues.**

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/PNXcjgcR)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=18536152)
