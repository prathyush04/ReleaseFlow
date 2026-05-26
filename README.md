# ReleaseFlow

ReleaseFlow is a robust full-stack web application designed to orchestrate and monitor software projects, their individual releases, and automated deployment pipelines. It provides a centralized dashboard to track the entire lifecycle of a release, from creation to live deployment, with a heavy emphasis on Vercel integration, security, and auditability.

## Core Concepts

The domain of ReleaseFlow is built around several key entities:

- **Projects**: The top-level container for a software application. A project securely stores your Vercel Project ID and authentication tokens, linking your ReleaseFlow workspace to your actual Vercel hosting environment.
- **Releases**: Specific versions of a Project. Releases store version numbers, descriptions, and custom webhook URLs. They maintain a strict status lifecycle (e.g., IN_PROGRESS, SUCCESS, FAILED).
- **Deployments**: The physical act of pushing a Release to an environment. Deployments can be standard or "Rollbacks". ReleaseFlow automatically triggers Vercel webhooks and actively polls Vercel's API to reflect real-time build states, updating the deployment status dynamically.
- **Audit Logs**: Every critical action taken by a user (e.g., creating a project, triggering a deployment, rolling back a release) is immutable and recorded in the AuditLog system, providing complete traceability.
- **Users and Roles**: Access is governed by a secure User system utilizing role-based access control, ensuring that only authorized personnel can trigger or modify deployments.

## Architecture & Technology Stack

The application relies on a modern, decoupled architecture:

### Backend Architecture
The backend is a RESTful API built to handle complex business logic, database transactions, and background task scheduling.
- **Framework**: Java 17+ with Spring Boot
- **Persistence**: Spring Data JPA / Hibernate
- **Security**: Spring Security with JWT (JSON Web Tokens) for stateless authentication
- **Integration**: Scheduled background workers (via `@Scheduled`) continuously poll the Vercel API to synchronize deployment states locally.
- **Build Tool**: Maven

### Frontend Architecture
The frontend is a dynamic, responsive single-page application.
- **Framework**: React 19
- **Build Tool**: Vite for fast hot-module replacement and optimized production builds
- **Routing**: React Router DOM for client-side navigation
- **HTTP Client**: Axios configured with interceptors for seamless JWT injection
- **UI & Icons**: Modern aesthetic utilizing Lucide React for iconography

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory.
2. Ensure you have Java (JDK 17 or newer) and Maven installed on your system.
3. Configure your database settings in `src/main/resources/application.yml` if necessary.
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Ensure you have Node.js (v18 or newer) installed.
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Development Workflow

When modifying the application, please adhere to the following workflow:
1. Ensure the Backend API is running on its default port before attempting frontend login.
2. The frontend runs on port 5173 by default. The backend CORS configuration explicitly permits this origin.
3. Verify Vercel Tokens when testing deployments locally, as invalid tokens will simply be skipped by the polling worker.
