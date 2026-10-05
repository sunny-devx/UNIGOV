# UNIGOV — Unified Government Services Integration Platform

**SIH Problem Statement ID:** SIH26129  
**Theme:** Smart India Hackathon 2026 — Governance & Public Services  

---

## 1. Problem Description

Citizens and businesses across India currently face severe friction and fragmented experiences when accessing government services. Because municipal, state, and central departments independently designed their digital portals, backend databases, authentication schemes, and workflow pipelines, users must navigate dozens of disjointed websites with isolated logins and incompatible identity schemes. This siloed ecosystem forces citizens to repeatedly enter personal information, upload redundant documents, and track disparate application statuses, while preventing cross-departmental coordination, unified auditing, and real-time governance transparency.

---

## 2. Proposed Solution

UNIGOV addresses this challenge through a dual-layer architectural approach: a unified citizen-facing portal coupled with an intelligent interoperability and integration middleware. By establishing standardized API schemas, data transformation adapters, unified identity bridging, and asynchronous orchestration, UNIGOV federates legacy and modern departmental services under a single digital umbrella. Citizens enjoy a consolidated dashboard for service discovery, application filing, status tracking, and document reuse, while government departments retain autonomous operational control over their domain databases and workflows through secure, audited integration interfaces.

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18 / 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Language & Runtime:** Java 21
- **Framework:** Spring Boot 3.3.x
- **Build Tool:** Apache Maven
- **Core Modules:** Spring Web, Spring Data JPA, Spring Validation
- **Database Driver:** PostgreSQL JDBC Driver

### Database & Infrastructure
- **Database:** PostgreSQL 16+
- **Containerization:** Docker & Docker Compose (for local development)

---

## 4. Local Setup Commands

### Prerequisites
- Java 21 (JDK 21)
- Apache Maven 3.9+
- Node.js 18+ and npm 9+
- Docker & Docker Compose (or local PostgreSQL instance)

---

### Step 1: Clone and Enter Repository
```bash
git clone <repository-url>
cd UNIGOV
```

---

### Step 2: Start PostgreSQL Database

#### Option A: Using Docker Compose
```bash
docker compose up -d
```

#### Option B: Using Local PostgreSQL (Homebrew / System Service)
Ensure PostgreSQL is running on port 5432 and create the database & user:
```bash
psql -U postgres -c "CREATE USER unigov WITH PASSWORD 'unigov_secret' SUPERUSER;"
psql -U postgres -c "CREATE DATABASE unigov OWNER unigov;"
```

---

### Step 3: Run Backend (Spring Boot)

```bash
cd backend
mvn clean spring-boot:run
```

The backend server starts on `http://localhost:8080`.

**Verify Health Endpoint:**
```bash
curl http://localhost:8080/api/health
```
Expected response:
```json
{
  "status": "UP",
  "service": "UNIGOV"
}
```

---

### Step 4: Run Frontend (React + Vite)

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The frontend application starts on `https://unigov-topaz.vercel.app/`.

---

### Running Tests & Building

#### Backend Tests & Build:
```bash
cd backend
mvn clean test
mvn clean package -DskipTests=false
```

#### Frontend Build:
```bash
cd frontend
npm run build
```
