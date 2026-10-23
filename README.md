# Planora-Events-Event-Management-System
Welcome to Planora Events, a modern and intuitive event management system designed to streamline the planning, booking, and execution of events. Whether you're organizing a wedding, corporate event, or private gathering, Planora makes the process seamless and elegant.


📌 Project Overview
Planora Events bridges the gap between clients, event managers, and vendors through a centralized system that enhances communication, automates workflows, and ensures smooth event execution.


🎯 Key Objectives
Enable seamless event creation, vendor coordination, and service bookings

Implement invoice generation, secure payments, and feedback collection

Introduce AI-powered smart budgeting to optimize event costs and ROI


💻 Live Resources

🔗 📐 Lucidchart System Diagrams

🎯 View Figma Prototype ([https://www.figma.com/proto/YabkitU17XPCEJWqyKMd6r/Planora?page-id=0%3A1&node-id=20-2&p=f&viewport=-2%2C136%2C0.13&t=l1OOSPj4qsFKXLnh-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=4%3A203].


🧩 Core Features

📋 Event Request System – Capture client needs like date, type, budget, and headcount

🏛 Vendor Booking – Select and confirm venue, catering, photography, and decoration

💸 Invoice + Payment Flow – Auto-generate invoices and validate secure transactions

📸 Photography Booking Page – View bios, availability, and rates for photographers

🖼 Portfolio Gallery – Showcase completed events and client testimonials

📨 Feedback System – Collect and analyze post-event feedback for service improvement


🧠 AI Smart Budgeting (Conceptual) – Recommend cost-effective services under budget

🛠 Technologies Used

Design Tools: Figma, Lucidchart

Frontend Frameworks: (Recommended) HTML/CSS/React.js

Data Modeling: ER Diagrams, Class Diagrams

Project Tools: Gantt Chart, WBS, MoM, Resource Allocation Plans


🧠 System Design Diagrams

Includes:

BPMN, Context Diagram, Use Case Diagram + Descriptions

Activity Diagrams (Requirements, Planning, Payment, Booking, Feedback)

Class Diagram, ERD, Data Flow Diagram

Sequence and Statechart Diagrams for all subsystems


🔐 Security Measures

🔒 User Authentication (Role-based access)

🔐 Encrypted Data Transfer

💳 Secure Payment Gateway Integration

🔍 Audit Logs and Compliance Checks


📈 Project Management

Includes:

Gantt Chart for timeline tracking

WBS for task breakdown

Financial estimation: break-even analysis, investment ROI, pricing model


## Planora Events 2.0 — Phase 1 (local)

Phase 1 is the event request vertical only: create and retrieve events. Original PDFs and this overview stay in the repo. Payments, vendor booking, AI, and microservices are out of scope.

### Prerequisites
- Java 21
- Maven 3.9+ (or use the included `backend/mvnw`)
- Node.js 20+
- Docker Desktop (PostgreSQL via Compose, Testcontainers for API tests)

### Configure
Copy `.env.example` to `.env` in the repo root if you need local overrides. Defaults are:

- PostgreSQL `planora` / `planora` / `planora` on port `5432`
- API `http://localhost:8080`
- Web `http://localhost:5173` (Vite also proxies `/api` to the API)

### Start
```bash
docker compose up -d
cd backend && ./mvnw spring-boot:run   # Windows: .\\mvnw.cmd spring-boot:run
cd frontend && npm install && npm run dev
```

Open http://localhost:5173 to list events and http://localhost:5173/events/new to submit a request.

## Phase 2 — accounts and manager review

Event APIs now require a JWT. Register as a client, or use the seeded demo users (created on API startup):

- Client: `client@planora.local` / `Planora123!`
- Event manager: `manager@planora.local` / `Planora123!`

A client only sees their own requests. A manager sees the inbox, can request more details, accept into `PLANNING`, or reject. Self-service registration always creates a `CLIENT` (managers are internal).

New routes: `/login`, `/register`, `GET /api/v1/me`, `POST /api/v1/auth/login`, `POST /api/v1/auth/register`.

### Tests
```bash
cd backend && ./mvnw verify   # Windows: .\\mvnw.cmd verify
cd frontend && npm test
cd frontend && npm run build
```




